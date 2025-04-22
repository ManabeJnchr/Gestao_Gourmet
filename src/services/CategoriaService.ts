import CategoriaModel from "../models/CategoriaModel";

class CategoriaService {
    static async listarCategorias () {
        try {
        
            const result = CategoriaModel.listarCategorias();
        
            return result
        
        } catch (err: any) {
            console.error("Erro no service: ", err);
        
            if (err.statusCode) {
                throw err;
            }
        
            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async buscarCategoriaPorId(id_categoria:any) {
        try {

            const number_id_categoria = Number(id_categoria)
            if (isNaN(number_id_categoria )) {
                throw { statusCode: 400, message: "Categoria inválida ou inexistente" }
            }

            const result = CategoriaModel.buscarCategoriaPorId(number_id_categoria );

            return result

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async buscarCategoriaPorNome (nome:string) {
        try {

            const result = CategoriaModel.buscarCategoriaPorNome(nome);

            return result

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }
}

export default CategoriaService;