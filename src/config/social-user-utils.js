import jwt from 'jsonwebtoken';
import SocialAccount from '../app/models/SocialAccount';
import User from '../app/models/User';
import Mail from '../lib/Mail';
import AuthConfig from './auth';

class SocialUser {
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
}

export default new SocialUser();
