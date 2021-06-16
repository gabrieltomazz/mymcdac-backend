import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import AuthConfig from '../../config/auth';
import loginGoogle from '../../config/google-util';

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
        return res.redirect(loginGoogle.urlGoogle());
    }

    async callbackGoogle(req, res) {
        return res.json(loginGoogle.getGoogleAccountFromCode(req.query.code));
    }
}

export default new SessionController();
