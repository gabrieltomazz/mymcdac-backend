import OptionAnswer from '../models/OptionAnswer';

class OptionsAnswersController {
    async delete(req, res) {
        const optin_id = req.params.id;

        // verify if id is valid
        if (Number.isNaN(optin_id)) {
            return res.status(400).json({ error: { mensagem: 'Id Inválido!' } });
        }

        try {
            // delete scale
            await OptionAnswer.destroy({
                where: {
                    id: optin_id,
                },
            });

            return res.status(200).json({ success: { mensagem: 'Removido com Sucesso!' } });
        } catch (error) {
            return res.status(400).json({ error: { mensagem: 'Erro ao deletar Opção de Resposta!' } });
        }
    }
}

export default new OptionsAnswersController();
