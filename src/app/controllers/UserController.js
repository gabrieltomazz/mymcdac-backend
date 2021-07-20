import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import AuthConfig from '../../config/auth';
import Mail from '../../lib/Mail';

class UserController {
    async store(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const userExists = await User.findOne({ where: { email: req.body.email } });

        if (userExists) {
            return res.status(400).json({ error: { mensagem: 'Usuário já Existe!' } });
        }

        const { id, name, email } = await User.create(req.body);

        const message = {
            to: `${name} <${email}>`,
            subject: 'Seja Bem-Vindo',
            template: 'welcome',
            context: {
                name,
            },
        };

        await Mail.sendMail(message);

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

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            passwordConfirm: Yup.string()
                .when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados invalidos!' } });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });

            if (emailExists) {
                return res.status(400).json({
                    error: {
                        email: 'Email já utiliazado ',
                    },
                });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: { password: 'Senhas não coincidem' } });
        }

        await user.update(req.body);
        const { id, name } = await User.findByPk(req.userId);

        return res.json({
            id,
            name,
            email,
        });
    }

    async getUser(req, res) {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(400).json({ error: { mensagem: 'Usuário não existe!' } });
        }

        return res.json(user);
    }
}

export default new UserController();
