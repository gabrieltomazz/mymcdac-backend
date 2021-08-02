import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import * as Yup from 'yup';

import User from '../models/User';
import SocialAccount from '../models/SocialAccount';
import AuthConfig from '../../config/auth';
import ForgetPasswordConfig from '../../config/forget-password';
import LoginGoogle from '../../config/google-util';
import LoginFacebook from '../../config/facebook-util';
import Mail from '../../lib/Mail';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: { mensagem: 'Usuário não existe!' } });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: { password: 'Senha incorreta!' } });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
    }

    async googleAuth(req, res) {
        return res.json(LoginGoogle.urlGoogle());
    }

    async callbackGoogle(req, res) {
        const { provider_id, userEmail, userName } = await LoginGoogle.getGoogleAccountFromCode(req.query.code);
        const { status, response } = this.createSocialUser(provider_id, userEmail, userName, 'google');

        return res.status(status).json(response);
    }

    async facebookAuth(req, res) {
        return res.json(LoginFacebook.urlFacebook());
    }

    async callbackFacebook(req, res) {
        const access_token = await LoginFacebook.getAccessTokenFromCode(req.query.code);
        const { provider_id, userEmail, userName } = await LoginFacebook.getFacebookUserData(access_token);

        const { status, response } = this.createSocialUser(provider_id, userEmail, userName, 'facebook');

        return res.status(status).json(response);
    }

    async createSocialUser(provider_id, userEmail, userName, provider) {
        const userSocial = await SocialAccount.findOne({
            where: { provider_id },
            include: {
                model: User,
                attributes: ['id', 'name', 'email'],
            },
        });

        let id = null;
        let name = null;
        let email = null;

        if (!userSocial) {
            const userData = await User.create({ name: userName, email: userEmail });

            if (!userData) {
                return {
                    status: 400,
                    response: { error: { mensagem: 'Error ao criar Usuário!' } },
                };
            }

            await SocialAccount.create({ user_id: userData.id, provider, provider_id });

            id = userData.id;
            name = userData.name;
            email = userData.email;

            const message = {
                to: `${name} <${email}>`,
                subject: 'Seja Bem-Vindo',
                template: 'welcome',
                context: {
                    name,
                },
            };

            await Mail.sendMail(message);
        } else {
            id = userSocial.User.id;
            name = userSocial.User.name;
            email = userSocial.User.email;
        }

        return {
            status: 200,
            response: {
                user: {
                    id,
                    name,
                    email,
                },
                token: jwt.sign({ id }, AuthConfig.secret, {
                    expiresIn: AuthConfig.expiresIn,
                }),
            },
        };
    }

    async forgetPassword(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const { email } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: { mensagem: 'E-mail não cadastrado!' } });
        }

        const token = jwt.sign({ id: user.id }, ForgetPasswordConfig.secret, { expiresIn: ForgetPasswordConfig.expiresIn });

        try {
            const message = {
                to: `${user.name} <${user.email}>`,
                subject: 'Recuperar Senha',
                template: 'forgetpassword',
                context: {
                    name: user.name,
                    homepage: ForgetPasswordConfig.frontUrl,
                    link: `${ForgetPasswordConfig.frontUrl}/recover-password/new-password/${token}`,
                },
            };
            await Mail.sendMail(message);

            return res.status(200).json({ succcess: { mensagem: 'E-mail enviado com Sucesso!' } });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Ao enviar email.' } });
        }
    }

    async verifyToken(req, res) {
        const { token } = req.params;

        // verify if id is valid
        if (Number.isNaN(token)) {
            return res.status(401).json({ error: 'Token INVÁLIDO' });
        }

        try {
            const decoded = await promisify(jwt.verify)(token, ForgetPasswordConfig.secret);

            const userId = decoded.id;

            const user = await User.findOne({
                where: { id: userId },
            });

            if (!user) {
                return res.status(401).json({ error: 'Token INVÁLIDO' });
            }

            return res.status(200).json('Ok!');
        } catch (err) {
            return res.status(401).json({ error: 'Token INVÁLIDO' });
        }
    }

    async changePassword(req, res) {
        const { token } = req.params;

        // verify if id is valid
        if (Number.isNaN(token)) {
            return res.status(401).json({ error: 'Token INVÁLIDO' });
        }

        const schema = Yup.object().shape({
            password: Yup.string().required().min(6),
            password_confirm: Yup.string()
                .when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        try {
            const decoded = await promisify(jwt.verify)(token, ForgetPasswordConfig.secret);

            const userId = decoded.id;

            const user = await User.findOne({
                where: { id: userId },
            });

            if (!user) {
                return res.status(401).json({ error: 'Token INVÁLIDO' });
            }
            await user.update(req.body);

            return res.status(200).json('Senha Atualizada com Sucesso!');
        } catch (err) {
            return res.status(401).json({ error: 'Token INVÁLIDO' });
        }
    }
}

export default new SessionController();
