import * as Yup from 'yup';

import Scale from '../models/Scale';
import OptionAnswer from '../models/OptionAnswer';
import Project from '../models/Project';

class ScaleController {
    async store(req, res) {
        // Fields Validation
        const schema = Yup.array().of(
            Yup.object().shape({
                answer: Yup.string().required(),
                good: Yup.boolean().required(),
                neutral: Yup.boolean().required(),
            }),
        );

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const optionsAnswers = req.body;
        // create description
        const reducer = (description, arr, index) => (index === 0 ? arr.answer : `${description} - ${arr.answer}`);
        const description = optionsAnswers.reduce(reducer, '');

        try {
            // Begin Transaction
            // const result = await Sequelize.transaction(async (t) => {

            // persist scale
            const { id } = await Scale.create({
                user_id: req.userId,
                description,
            });

            // insert id_scale on options
            optionsAnswers.forEach((element, index) => {
                optionsAnswers[index].scale_id = id;
            });

            // Persist options
            return await OptionAnswer.bulkCreate(optionsAnswers).then(() => Scale.findOne({
                where: { id },
                attributes: ['id', 'description'],
                include: {
                    model: OptionAnswer,
                    as: 'optionAnswers',
                    attributes: ['id', 'answer', 'neutral', 'good'],
                },
            })).then((options) => res.status(200).json(options));

            // });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao criar Scale!' } });
        }
    }

    async update(req, res) {
        // Fields Validation
        const schema = Yup.array().of(
            Yup.object().shape({
                id: Yup.number().nullable(true),
                answer: Yup.string().required(),
                good: Yup.boolean().required(),
                neutral: Yup.boolean().required(),
            }),
        );

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const optionsAnswers = req.body;
        const scale_id = req.params.id;

        if (Number.isNaN(scale_id)) {
            return res.status(400).json({ error: { mensagem: 'Scale id Inválido!' } });
        }

        // build description
        const reducer = (description, arr, index) => (index === 0 ? arr.answer : `${description} - ${arr.answer}`);
        const description = optionsAnswers.reduce(reducer, '');

        try {
            // find scale
            const scale = await Scale.findByPk(scale_id);

            // verify if scale is empty
            if (!scale) {
                return res.status(401).json({ error: { mensagem: 'Invalid Scale!' } });
            }

            // update scale
            await scale.update({
                description,
            });

            // update option
            for (let index = 0; index < optionsAnswers.length; index += 1) {
                const element = optionsAnswers[index];

                if (element.id) {
                    const options = await OptionAnswer.findByPk(element.id);
                    // update options
                    await options.update(element);
                    options.save();
                } else {
                    element.scale_id = scale_id;
                    await OptionAnswer.create(element);
                }
            }

            const scales = await Scale.findOne({
                where: { id: scale_id },
                attributes: ['id', 'description'],
                include: {
                    model: OptionAnswer,
                    as: 'optionAnswers',
                    attributes: ['id', 'answer', 'neutral', 'good'],
                },
            });

            return res.status(200).json(scales);
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao atualizar Scale!' } });
        }
    }

    async getScaleAll(req, res) {
        // find all scales
        const scale = await Scale.findAll();

        return res.status(200).json(scale);
    }

    async getScaleByUserId(req, res) {
        // user_id extracted from token
        const scale = await Scale.findAll({
            where: { user_id: req.userId },
            attributes: ['id', 'description'],
            include: {
                model: OptionAnswer,
                as: 'optionAnswers',
                attributes: ['id', 'answer', 'neutral', 'good'],
            },
            order: [[{ model: OptionAnswer, as: 'optionAnswers' }, 'id', 'asc']],
        });

        return res.status(200).json(scale);
    }

    async delete(req, res) {
        const scale_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(scale_id)) {
            return res.status(400).json({ error: { mensagem: 'Scale id Inválido!' } });
        }

        const projects = await Project.findOne({
            where: { scale_id },
        });

        if (projects) {
            return res.status(401).json({ error: { mensagem: 'Erro! Existem Projetos vinculados a está escala.' } });
        }

        try {
            // delete scale
            await Scale.destroy({
                where: {
                    id: scale_id,
                },
            });

            return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!' } });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao deletar Scale!' } });
        }
    }
}

export default new ScaleController();
