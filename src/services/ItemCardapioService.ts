import ItemCardapioModel from "../models/ItemCardapioModel";
import CategoriaService from "./CategoriaService";
import pool from "../database/index";
import AdicionaisService from "./AdicionaisService";

interface itemCardapioDTO {
    id_itemcardapio?: any,
    nome?: string,
    valor?: any,
    id_categoria?: any,
    descricao?: string,
    imagem?: string,
    adicionais?: Array<any>,
}

class ItemCardapioService {
    static async salvarItemCardapio({ id_itemcardapio, nome, valor, id_categoria, descricao, adicionais }: itemCardapioDTO, imagemBuffer : any) {
        try {
            
            if (!id_itemcardapio || !nome || !valor || !id_categoria || !descricao || !adicionais) {
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
                return await this.adicionarItemCardapio({nome:nomeFormatado, valor:numero_valor, id_categoria:numero_id_categoria, descricao:descricaoFormatada, adicionais}, imagemBuffer);
            } else { // Atualizar item
                return await this.atualizarItemCardapio({id_itemcardapio:numero_id_itemcardapio, nome:nomeFormatado, valor:numero_valor, id_categoria:numero_id_categoria, descricao:descricaoFormatada, adicionais}, imagemBuffer);

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
            const cardapio = await ItemCardapioModel.listarCardapio();

            for (const item of cardapio) {
                item.adicionais = await AdicionaisService.listarAdicionais({id_itemcardapio:item.id_itemcardapio});

                if (item.imagem) {
                    const base64 = item.imagem.toString('base64');
                    item.imagemBase64 = `data:image/png;base64,${base64}`;
                }
            }

            return cardapio;

        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

    static async adicionarItemCardapio ({nome, valor, id_categoria, descricao, adicionais}: itemCardapioDTO, imagemBuffer : any) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const novoItem = await ItemCardapioModel.adicionarItemCardapio(nome, valor, id_categoria, descricao, imagemBuffer, client)

            // Criar adicionais no banco de dados
            novoItem.adicionais = [];

            if (adicionais) {
                for (const adicional of adicionais) {
                    adicional.id_itemcardapio = novoItem.id_itemcardapio
    
                    const novoAdicional = await AdicionaisService.novoAdicional(adicional, client);
                    
                    novoItem.adicionais.push(novoAdicional)
                }
            }

            await client.query("COMMIT");

            return novoItem;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            await client.query("ROLLBACK");

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        } finally {
            client.release();
        }
    }

    static async atualizarItemCardapio ({id_itemcardapio, nome, valor, id_categoria, descricao, adicionais}: itemCardapioDTO, imagemBuffer : any) {
        const client = await pool.connect();

        try { 
            await client.query("BEGIN");

            const item = await ItemCardapioModel.atualizarItemCardapio(id_itemcardapio, nome, valor, id_categoria, descricao, client)
            console.log(item);
            if (imagemBuffer) {
                const imagem = await ItemCardapioModel.atualizarImagem(id_itemcardapio, imagemBuffer, client);
                item.imagem = imagem;
            }
            console.log(item);

            const adicionaisAntigos = await AdicionaisService.listarAdicionais({id_itemcardapio});
            const adicionaisAntigosMap = new Map(adicionaisAntigos.map(a => [a.id_adicional, a]))

            if (adicionais) {
                for (const adicional of adicionais) {
                    if (adicional.id_adicional === -1) { // Novo adicional:
                        const novoAdicional = await AdicionaisService.novoAdicional(adicional, client);
    
                        adicional.id_adicional = novoAdicional.id_adicional;
                    } else if (adicionaisAntigosMap.has(adicional.id_adicional)) { // Atualizar adicional
                        await AdicionaisService.atualizarAdicional(adicional, client);
                        adicionaisAntigosMap.delete(adicional.id_adicional) // Já foi tratado, remover do map
                    }
                }

            }
            
            // Deletar os que sobraram
            for (const [id] of adicionaisAntigosMap) {
                await AdicionaisService.deletarAdicional({id_adicional: id}, client);
            }

            item.adicionais = adicionais;
            
            await client.query("COMMIT");
            return item;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            await client.query("ROLLBACK");

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        } finally {
            client.release();
        }
    }

    static async deletarItemCardapio({id_itemcardapio} : itemCardapioDTO) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            if (!id_itemcardapio) {
                throw { statusCode: 400, message: "ID do item não especificado" }
            }
            
            const numero_id_itemcardapio = Number(id_itemcardapio);
            
            if (isNaN(numero_id_itemcardapio)) {
                throw { statusCode: 400, message: "ID do item inválido" }
            }

            const result = await ItemCardapioModel.deletarItemCardapio(numero_id_itemcardapio, client)

            await client.query("COMMIT");

            return result
        } catch (err: any) {
            console.error("Erro no service: ", err);

            await client.query("ROLLBACK");

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        } finally {
            client.release();
        }
    }

    static async buscarItemCardapio({id_itemcardapio} : itemCardapioDTO) {
        try {
            if (!id_itemcardapio) {
                throw { statusCode: 400, message: "ID do item não especificado" }
            }
            
            const numero_id_itemcardapio = Number(id_itemcardapio);            
            if (isNaN(numero_id_itemcardapio)) {
                throw { statusCode: 400, message: "ID do item inválido" }
            }

            const result = await ItemCardapioModel.buscarItemCardapio(numero_id_itemcardapio)

            return result;
        } catch (err: any) {
            console.error("Erro no service: ", err);

            if (err.statusCode) {
                throw err;
            }

            throw { statusCode: 500, message: "Erro interno no servidor" }
        }
    }

}

export default ItemCardapioService;