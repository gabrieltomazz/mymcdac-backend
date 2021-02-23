import * as Yup from 'yup';
import snakeCaseKeys from 'snakecase-keys';

import Project from '../models/Project';

class ProjectController {

    async store(req, res) {

        // Fields Validation
        const schema = Yup.object().shape({
            projectGoal: Yup.string().required(),
            projectLocus: Yup.string().required(),
            performance: Yup.string().required(),
            steps: Yup.number().required(),
            startDate: Yup.date().required(),
            endDate: Yup.date().required(),
            scaleId: Yup.number().required(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!'} });
        }

        // convert Json to snake case
        const project = snakeCaseKeys(req.body);
        project.user_id = req.userId;

        //create project
        try {
            const { id, project_goal, project_locus } = await Project.create(project);
            
            return res.status(200).json({ 
                id,
                projectGoal: project_goal,
                projectLocus: project_locus
            });
        }catch (error){
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao salvar projeto.'} });
        }
    }

    async update(req, res) {

        // Fields Validation
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            projectGoal: Yup.string(),
            projectLocus: Yup.string(),
            performance: Yup.string(),
            steps: Yup.number(),
            startDate: Yup.date(),
            endDate: Yup.date(),
            scaleId: Yup.number(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!'} });
        }

        //update project
        try {
            const project = snakeCaseKeys(req.body);

            // find project
            const projects = await Project.findByPk(project.id);
            
            // verify if projects is empty
            if(!projects){
                return res.status(401).json({ error: { mensagem: 'Invalid Scale!'} });
            }

            // update project
            const { id, project_goal, project_locus } = await projects.update(project);
            
            return res.status(200).json({ 
                id,
                projectGoal: project_goal,
                projectLocus: project_locus
            });
        }catch (error){
            return res.status(400).json({ error: { mensagem: 'Erro! Falha ao atualizar projeto.'} });
        }

    }

    async getProjectById(req, res) {

        try{
            // user_id extracted from token 
            const projects = await Project.findAll({
                where: { user_id: req.userId },
                order: ['id']
            });

            return res.status(200).json(projects);

        }catch(error) {
            return res.status(200).json({ error: { mensagem: 'Falha ao consultar projeto!'} });
        }        
    }

    async delete(req, res){

        const project_id = req.params.id;

        // verify if id is valid
        if(isNaN(project_id)){
            return res.status(400).json({ error: { mensagem: 'Project id Inválido!'} });
        }

        try{
            // delete project 
            await Project.destroy({
                where: {
                    id: project_id
                }
            });

            return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!'} });

        }catch(error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao deletar Projeto!'} });
        }

    }
}

export default new ProjectController();