import ItemCardapioModel from "../models/ItemCardapioModel";
import CategoriaService from "./CategoriaService";

interface itemCardapioDTO {
    id_itemcardapio?: any,
    nome?: string,
    valor?: any,
    id_categoria?: any,
    descricao?: string,
    imagem?: string,
    adicionais?: Array<string>,
}

class MesaService {
    static async salvarItemCardapio({ id_itemcardapio, nome, valor, id_categoria, descricao, imagem, adicionais }: itemCardapioDTO) {
        try {

            
            if (!id_itemcardapio || !nome || !valor || !id_categoria || !descricao) {
                throw { statusCode: 400, message: "Faltam argumentos" }
            }
            
            const numero_id_itemcardapio = Number(id_itemcardapio);            
            if (isNaN(numero_id_itemcardapio)) {
                throw { statusCode: 400, message: "ID do item é inválido" }
            }

            const numero_id_categoria = Number(id_categoria);            
            if (isNaN(numero_id_categoria)) {
                throw { statusCode: 400, message: "ID da categoria é inválido" }
            }
            
            const verificarCategoria = await CategoriaService.buscarCategoriaPorId(numero_id_categoria)
            
            if (!verificarCategoria) {
                throw { statusCode: 400, message: "ID da categoria é inexistente" }
            }

            const nomeFormatado = nome.trim();            
            if (!nomeFormatado) {
                throw { statusCode: 400, message: "Nome inválido" }
            }

            const descricaoFormatada = descricao.trim();
            if (!descricaoFormatada) {
                throw { statusCode: 400, message: "Descrição inválida" }
            }
            
            const numero_valor = Number(valor)

            if (numero_valor <= 0) {
                throw { statusCode: 400, message: "Valor do item deve ser maior que 0"}
            }

            if (numero_id_itemcardapio === -1) { // Novo item
                return await this.adicionarItemCardapio({nome:nomeFormatado, valor:numero_valor, id_categoria:numero_id_categoria, descricao:descricaoFormatada, imagem});
            } else { // Atualizar item
                return await this.atualizarItemCardapio({id_itemcardapio:numero_id_itemcardapio, nome:nomeFormatado, valor:numero_valor, id_categoria:numero_id_categoria, descricao:descricaoFormatada, imagem});

            }

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async listarCardapio() {
        try {
            return await ItemCardapioModel.listarCardapio();
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async adicionarItemCardapio ({nome, valor, id_categoria, descricao, imagem}: itemCardapioDTO) {
        try {
            const result = await ItemCardapioModel.adicionarItemCardapio(nome, valor, id_categoria, descricao, imagem)

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async atualizarItemCardapio ({id_itemcardapio, nome, valor, id_categoria, descricao, imagem}: itemCardapioDTO) {
        try { 
            const result = await ItemCardapioModel.atualizarItemCardapio(id_itemcardapio, nome, valor, id_categoria, descricao, imagem)

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async deletarItemCardapio({id_itemcardapio} : itemCardapioDTO) {
        try {
            if (!id_itemcardapio) {
                throw { statusCode: 400, message: "ID do item não especificado" }
            }
            
            const numero_id_itemcardapio = Number(id_itemcardapio);
            
            if (isNaN(numero_id_itemcardapio)) {
                throw { statusCode: 400, message: "ID do item inválido" }
            }

            return await ItemCardapioModel.deletarItemCardapio(numero_id_itemcardapio);
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

}

export default MesaService;