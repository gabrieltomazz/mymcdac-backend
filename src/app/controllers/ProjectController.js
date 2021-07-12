import * as Yup from 'yup';

import Project from '../models/Project';
import Scale from '../models/Scale';
import Criteria from '../models/Criteria';

class ProjectController {
    async store(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            project_goal: Yup.string().required(),
            performance: Yup.string().required(),
            steps: Yup.number().required(),
            scale_id: Yup.number().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        const project = req.body;
        project.user_id = req.userId;

        // create project
        try {
            const { id, project_goal } = await Project.create(project);

            return res.status(200).json({
                id,
                project_goal,
            });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar projeto.' } });
        }
    }

    async update(req, res) {
        // Fields Validation
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            project_goal: Yup.string(),
            performance: Yup.string(),
            steps: Yup.number(),
            scale_id: Yup.number(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        // update project
        try {
            const project = req.body;

            // find project
            const projects = await Project.findByPk(project.id);

            // verify if projects is empty
            if (!projects) {
                return res.status(401).json({ error: { mensagem: 'Invalid Project!' } });
            }

            // update project
            const { id, project_goal } = await projects.update(project);

            return res.status(200).json({
                id,
                project_goal,
            });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao atualizar projeto.' } });
        }
    }

    async getProjectByUserId(req, res) {
        try {
            // user_id extracted from token
            const projects = await Project.findAll({
                where: { user_id: req.userId },
                include: {
                    model: Scale,
                    as: 'scale',
                    attributes: ['id', 'description'],
                },
                order: ['id'],
            });

            return res.status(200).json(projects);
        } catch (error) {
            return res.status(200).json({ error: { mensagem: 'Falha ao consultar projeto!' } });
        }
    }

    async getProjectById(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        try {
            // user_id extracted from token
            const projects = await Project.findOne({
                where: { id: project_id },
                include: {
                    model: Scale,
                    as: 'scale',
                    attributes: ['id', 'description'],
                },
            });

            return res.status(200).json(projects);
        } catch (error) {
            return res.status(200).json({ error: { mensagem: 'Falha ao consultar projeto!' } });
        }
    }

    async delete(req, res) {
        const project_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(project_id)) {
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!' } });
        }

        try {
            // delete project
            await Project.destroy({
                where: {
                    id: project_id,
                },
            });

            return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!' } });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao deletar Projeto!' } });
        }
    }

    async duplicateProject(req, res) {
        const schema = Yup.object().shape({
            project_id: Yup.number().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json(error);
        }

        // duplicate project
        try {
            const { project_id } = req.body;

            // find project
            const project = await Project.findOne({ where: { id: project_id }, raw: true, attributes: { exclude: ['id'] } });

            // verify if projects is empty
            if (!project) {
                return res.status(401).json({ error: { mensagem: 'Invalid Project!' } });
            }

            project.project_goal += ' (copy)';
            const newProject = await Project.create(project);

            // duplicate criteria
            const listCriteria = await Criteria.findAll({ where: { project_id }, raw: true, order: ['id'] });

            // find and create criteria
            for (let index = 0; index < listCriteria.length; index += 1) {
                listCriteria[index].project_id = newProject.id;
                const id_antigo = listCriteria[index].id;
                delete (listCriteria[index].id);

                const { id } = await Criteria.create(listCriteria[index]);

                for (let index_aux = 0; index_aux < listCriteria.length; index_aux += 1) {
                    if (listCriteria[index_aux].criterion_id === id_antigo) {
                        listCriteria[index_aux].criterion_id = id;
                    }
                }
            }
            const clonedProject = await Project.findOne({
                where: { id: newProject.id },
                include: {
                    model: Scale,
                    as: 'scale',
                    attributes: ['id', 'description'],
                },
            });

            return res.status(200).json(clonedProject);
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao duplicar projeto.' } });
        }
    }
}

export default new ProjectController();
