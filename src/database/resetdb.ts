import { Pool } from 'pg';
import dotenv from 'dotenv';
import dbinit from './dbinit'
import FuncionarioService from '../services/FuncionarioService';
import ItemCardapioService from '../services/ItemCardapioService';
import * as https from 'https';
import * as http from 'http';
import { Console } from 'console';

dotenv.config();

const pool: Pool = new Pool ({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(async (client) => {
        console.log(`# Conectado ao banco de dados: ${pool.options.database || pool.options.connectionString}`);
        await resetdb(pool);
        client.release(); // Liberar a conexão de volta para o pool
    })
    .catch(err => {
        console.error("# ❌ Erro ao conectar ao banco de dados:", err);
    });

async function resetdb (pool: Pool) {
    try {
        await pool.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
        `)
    
        await dbinit(pool);
    
        await criarItens();
        await criarFuncionarios();

        console.log("# Banco de dados resetado com sucesso");
    } catch (err : any) {
        console.error("# Erro ao resetar banco de dados: ", err);
        
    }
}

async function criarItens () {
    await ItemCardapioService.salvarItemCardapio({id_itemcardapio:-1, nome:"Macarronada", valor:"40", id_categoria:5, descricao:"Uma deliciosa macarronada", adicionais:[
        {nome:"Queijo", valor:"5", id_itemcardapio:-1},
        {nome:"Batata", valor:"6", id_itemcardapio:-1},
    ]}, await downloadImageAsBuffer("https://www.sabornamesa.com.br/media/k2/items/cache/b5b56b2ae93d3dc958cf0c21c9383b18_XL.jpg"))
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Bruschetta",
        valor: "28",
        id_categoria: "10",
        descricao: "Pão italiano fatiado, tomate, manjericão, alho, azeite, sal.",
        adicionais: [
          { nome: "Queijo de cabra", valor: "8", id_itemcardapio: -1 },
          { nome: "Presunto cru", valor: "10", id_itemcardapio: -1 },
          { nome: "Pesto de manjericão", valor: "7", id_itemcardapio: -1 }
    ]}, await downloadImageAsBuffer("https://img.freepik.com/fotos-gratis/sanduiches-italianos-bruschetta-com-queijo-tomate-seco-e-manjericao_2829-11045.jpg"))
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Batata Frita Crocante",
        valor: "22",
        id_categoria: 10,
        descricao: "Batata, óleo, sal grosso, ervas finas.",
        adicionais: [
            { nome: "Bacon crocante", valor: "6", id_itemcardapio: -1 },
            { nome: "Cheddar derretido", valor: "7", id_itemcardapio: -1 },
            { nome: "Aioli de alho", valor: "5", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Anéis de Cebola Empanados",
        valor: "24",
        id_categoria: 10,
        descricao: "Cebola, farinha de trigo, ovo, farinha de rosca, sal, óleo.",
        adicionais: [
            { nome: "Molho barbecue", valor: "4", id_itemcardapio: -1 },
            { nome: "Gorgonzola derretido", valor: "8", id_itemcardapio: -1 },
            { nome: "Páprica defumada", valor: "3", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Bolinho de Bacalhau",
        valor: "32",
        id_categoria: 10,
        descricao: "Bacalhau dessalgado, batata, cebola, salsa, ovo, farinha.",
        adicionais: [
            { nome: "Aioli de limão", valor: "6", id_itemcardapio: -1 },
            { nome: "Pimenta biquinho", valor: "5", id_itemcardapio: -1 },
            { nome: "Cebolinha picada", valor: "4", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Tábua de Frios",
        valor: "80",
        id_categoria: 10,
        descricao: "Queijos variados, salames, presunto, azeitonas, castanhas.",
        adicionais: [
            { nome: "Geleia de pimenta", valor: "10", id_itemcardapio: -1 },
            { nome: "Mel trufado", valor: "12", id_itemcardapio: -1 },
            { nome: "Castanhas caramelizadas", valor: "8", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Guacamole com Nachos",
        valor: "45",
        id_categoria: 10,
        descricao: "Abacate, tomate, cebola roxa, coentro, limão, sal, chips de milho.",
        adicionais: [
            { nome: "Sour cream", valor: "6", id_itemcardapio: -1 },
            { nome: "Jalapeños em conserva", valor: "5", id_itemcardapio: -1 },
            { nome: "Queijo cheddar ralado", valor: "7", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mini Espetinho de Camarão",
        valor: "55",
        id_categoria: 10,
        descricao: "Camarão, alho, azeite, limão, sal, palito de madeira.",
        adicionais: [
            { nome: "Molho de pimenta", valor: "5", id_itemcardapio: -1 },
            { nome: "Farofa crocante", valor: "6", id_itemcardapio: -1 },
            { nome: "Salsinha fresca", valor: "4", id_itemcardapio: -1 }
        ]
    }, null);
    
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Palitos de Mussarela Empanados",
        valor: "38",
        id_categoria: 10,
        descricao: "Mussarela, ovo, farinha de rosca, farinha de trigo, óleo, orégano.",
        adicionais: [
            { nome: "Molho marinara", valor: "5", id_itemcardapio: -1 },
            { nome: "Pesto de rúcula", valor: "7", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "4", id_itemcardapio: -1 }
        ]
    }, null);

    // Saladas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Caesar",
        valor: "45.00",
        id_categoria: "1", // Saladas
        descricao: "Alface romana, croutons, parmesão, molho Caesar.",
        adicionais: [
            { nome: "Frango grelhado", valor: "12.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Ovo de codorna", valor: "7.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Caprese",
        valor: "52.00",
        id_categoria: "1", // Saladas
        descricao: "Tomate, muçarela de búfala, manjericão, azeite, sal.",
        adicionais: [
            { nome: "Pesto de manjericão", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Pepino laminado", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Azeite trufado", valor: "10.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Grega",
        valor: "50.00",
        id_categoria: "1", // Saladas
        descricao: "Pepino, tomate, cebola roxa, azeitonas, queijo feta, orégano, azeite.",
        adicionais: [
            { nome: "Pimentão assado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Grão-de-bico", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Hortelã fresca", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mix de Folhas com Tomate e Pepino",
        valor: "40.00",
        id_categoria: "1", // Saladas
        descricao: "Alface, rúcula, agrião, tomate-cereja, pepino, molho simples.",
        adicionais: [
            { nome: "Tomate seco", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Queijo de cabra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Sementes de girassol", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Quinoa com Legumes",
        valor: "55.00",
        id_categoria: "1", // Saladas
        descricao: "Quinoa, cenoura, abobrinha, pimentão, ervas, azeite.",
        adicionais: [
            { nome: "Castanhas", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Queijo feta", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Tomate-cereja extra", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Beterraba com Laranja",
        valor: "45.00",
        id_categoria: "1", // Saladas
        descricao: "Beterraba cozida, laranja em gomos, rúcula, nozes, azeite.",
        adicionais: [
            { nome: "Queijo de cabra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Gergelim torrado", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Raspas de limão", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Tomate com Manjericão",
        valor: "42.00",
        id_categoria: "1", // Saladas
        descricao: "Tomate fatiado, manjericão, azeite, sal, pimenta.",
        adicionais: [
            { nome: "Muçarela de búfala", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Azeitonas pretas", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Redução de balsâmico", valor: "7.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Waldorf",
        valor: "50.00",
        id_categoria: "1", // Saladas
        descricao: "Maçã, uva, aipo, maionese, iogurte natural.",
        adicionais: [
            { nome: "Nozes", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Passas", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Salsão crocante", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    // Sopas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sopa de Legumes",
        valor: "42.00",
        id_categoria: "2", // Sopas
        descricao: "Cenoura, batata, chuchu, abobrinha, cebola, água, sal.",
        adicionais: [
            { nome: "Creme de leite", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Pão italiano fatiado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Salsinha picada", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Caldo Verde",
        valor: "40.00",
        id_categoria: "2", // Sopas
        descricao: "Couve, batata, calabresa, alho, azeite, sal.",
        adicionais: [
            { nome: "Torresmo crocante", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Pão de alho", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Queijo coalho em cubos", valor: "8.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Canja de Galinha",
        valor: "45.00",
        id_categoria: "2", // Sopas
        descricao: "Frango desfiado, arroz, cenoura, cebola, alho, sal.",
        adicionais: [
            { nome: "Gengibre ralado", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Cebolinha verde", valor: "4.00", id_itemcardapio: -1 },
            { nome: "Ovo pochê", valor: "7.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Creme de Cenoura",
        valor: "38.00",
        id_categoria: "2", // Sopas
        descricao: "Cenoura, batata, creme de leite, cebola, sal.",
        adicionais: [
            { nome: "Gorgonzola esfarelado", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Nozes picadas", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Semente de abóbora torrada", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sopa de Tomate",
        valor: "40.00",
        id_categoria: "2", // Sopas
        descricao: "Tomate, cebola, alho, caldo de legumes, manjericão.",
        adicionais: [
            { nome: "Croutons temperados", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Creme de ricota", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Orégano fresco", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sopa de Abóbora",
        valor: "42.00",
        id_categoria: "2", // Sopas
        descricao: "Abóbora, creme de leite, cebola, sal, pimenta.",
        adicionais: [
            { nome: "Gengibre em pó", valor: "4.00", id_itemcardapio: -1 },
            { nome: "Semente de girassol", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Creme de leite fresco", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Creme de Cogumelos",
        valor: "48.00",
        id_categoria: "2", // Sopas
        descricao: "Cogumelos, creme de leite, manteiga, cebola, sal.",
        adicionais: [
            { nome: "Trufas raladas", valor: "15.00", id_itemcardapio: -1 },
            { nome: "Cebolinha verde", valor: "4.00", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Minestrone",
        valor: "50.00",
        id_categoria: "2", // Sopas
        descricao: "Macarrão, feijão, legumes variados, molho de tomate, ervas.",
        adicionais: [
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pão italiano torrado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Azeite trufado", valor: "10.00", id_itemcardapio: -1 }
        ]
    }, null);

    // Aves
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Peito de Frango Grelhado com Ervas",
        valor: "75.00",
        id_categoria: "3", // Aves
        descricao: "Peito de frango, alecrim, tomilho, azeite, alho, sal.",
        adicionais: [
            { nome: "Queijo derretido", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Molho de mostarda", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Mix de pimentas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango à Passarinho",
        valor: "70.00",
        id_categoria: "3", // Aves
        descricao: "Pedaços de frango, alho, limão, sal, óleo.",
        adicionais: [
            { nome: "Molho vinagrete", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Farofa temperada", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Páprica doce", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Filé de Frango Empanado",
        valor: "75.00",
        id_categoria: "3", // Aves
        descricao: "Filé de frango, ovo, farinha de rosca, farinha de trigo, sal.",
        adicionais: [
            { nome: "Molho tártaro", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pimenta calabresa", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Espetinho de Frango",
        valor: "72.00",
        id_categoria: "3", // Aves
        descricao: "Cubos de frango, azeite, sal, temperos, palito de madeira.",
        adicionais: [
            { nome: "Molho barbecue", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Cebola caramelizada", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Farofa crocante", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Strogonoff de Frango",
        valor: "78.00",
        id_categoria: "3", // Aves
        descricao: "Frango, creme de leite, molho de tomate, champignon, cebola.",
        adicionais: [
            { nome: "Batata palha extra", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Shimeji salteado", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Cogumelos frescos", valor: "8.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango ao Molho de Mostarda",
        valor: "85.00",
        id_categoria: "3", // Aves
        descricao: "Peito de frango, creme de leite, mostarda, cebola, sal.",
        adicionais: [
            { nome: "Mel", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Nozes picadas", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Salsa fresca", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango ao Curry",
        valor: "85.00",
        id_categoria: "3", // Aves
        descricao: "Frango, curry, leite de coco, cebola, alho, coentro.",
        adicionais: [
            { nome: "Gengibre fresco", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Coentro extra", valor: "4.00", id_itemcardapio: -1 },
            { nome: "Amêndoas tostadas", valor: "8.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sanduíche de Frango Desfiado",
        valor: "48.00",
        id_categoria: "3", // Aves
        descricao: "Pão brioche, frango desfiado, maionese, alface, tomate.",
        adicionais: [
            { nome: "Queijo cheddar", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Picles", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    // Carnes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Bife Acebolado",
        valor: "95.00",
        id_categoria: "4", // Carnes
        descricao: "Bife bovino, cebola, alho, azeite, sal, pimenta.",
        adicionais: [
            { nome: "Cebolas caramelizadas", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Queijo gorgonzola", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Mix de pimentas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Picanha Grelhada",
        valor: "150.00",
        id_categoria: "4", // Carnes
        descricao: "Picanha, sal grosso, azeite.",
        adicionais: [
            { nome: "Chimichurri", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Farofa miúda", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Vinagrete", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Filé Mignon ao Alho",
        valor: "180.00",
        id_categoria: "4", // Carnes
        descricao: "Filé mignon, alho, manteiga, sal, pimenta.",
        adicionais: [
            { nome: "Batata rústica", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Manteiga especial", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Ervas finas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Strogonoff de Carne",
        valor: "120.00",
        id_categoria: "4", // Carnes
        descricao: "Carne em tiras, creme de leite, molho de tomate, champignon.",
        adicionais: [
            { nome: "Batata palha extra", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Cogumelos frescos", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Creme de leite extra", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Kafta de Carne Bovina",
        valor: "85.00",
        id_categoria: "4", // Carnes
        descricao: "Carne moída, cebola, alho, hortelã, especiarias, palito.",
        adicionais: [
            { nome: "Coalhada seca", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pão sírio", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Pimenta síria", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Almôndegas ao Molho",
        valor: "80.00",
        id_categoria: "4", // Carnes
        descricao: "Carne moída, ovo, farinha de rosca, molho de tomate, ervas.",
        adicionais: [
            { nome: "Purê de batata", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Ervas aromáticas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Carne de Panela com Legumes",
        valor: "90.00",
        id_categoria: "4", // Carnes
        descricao: "Carne em cubos, cenoura, batata, cebola, caldo, temperos.",
        adicionais: [
            { nome: "Arroz branco", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Farofa caseira", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Cebolinha", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Escondidinho de Carne Seca",
        valor: "110.00",
        id_categoria: "4", // Carnes
        descricao: "Purê de mandioca, carne seca desfiada, queijo, manteiga.",
        adicionais: [
            { nome: "Queijo gratinado extra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pimenta biquinho", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    // Massas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Espaguete ao Sugo",
        valor: "60.00",
        id_categoria: "5", // Massas
        descricao: "Espaguete, molho de tomate, manjericão, azeite, alho.",
        adicionais: [
            { nome: "Almôndegas", valor: "12.00", id_itemcardapio: -1 },
            { nome: "Queijo parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pimenta calabresa", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Penne ao Molho Alfredo",
        valor: "65.00",
        id_categoria: "5", // Massas
        descricao: "Penne, creme de leite, parmesão, manteiga, nozmoscada.",
        adicionais: [
            { nome: "Cubos de frango grelhado", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Brócolis ao vapor", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Talharim ao Pesto",
        valor: "68.00",
        id_categoria: "5", // Massas
        descricao: "Talharim, manjericão, pinoli, parmesão, azeite, alho.",
        adicionais: [
            { nome: "Tomate-cereja", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Muçarela de búfala", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Raspas de limão", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Lasanha à Bolonhesa",
        valor: "75.00",
        id_categoria: "5", // Massas
        descricao: "Massa para lasanha, molho bolonhesa, queijo, molho bechamel.",
        adicionais: [
            { nome: "Queijo gratinado extra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Molho branco adicional", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Orégano fresco", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Fettuccine Alfredo",
        valor: "70.00",
        id_categoria: "5", // Massas
        descricao: "Fettuccine, creme de leite, parmesão, manteiga.",
        adicionais: [
            { nome: "Champignons salteados", valor: "9.00", id_itemcardapio: -1 },
            { nome: "Cubos de peito de peru", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Pimenta-do-reino moída na hora", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Nhoque ao Sugo",
        valor: "65.00",
        id_categoria: "5", // Massas
        descricao: "Nhoque de batata, molho de tomate, manjericão.",
        adicionais: [
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Tomate seco", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Folhas de manjericão extra", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Canelone de Ricota com Espinafre",
        valor: "75.00",
        id_categoria: "5", // Massas
        descricao: "Massa de canelone, ricota, espinafre, molho bechamel, queijo.",
        adicionais: [
            { nome: "Nozes picadas", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Molho de tomate extra", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Queijo vegano", valor: "10.00", id_itemcardapio: -1 }
        ]
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Rigatoni com Ragu",
        valor: "72.00",
        id_categoria: "5", // Massas
        descricao: "Rigatoni, ragu de carne, parmesão.",
        adicionais: [
            { nome: "Farofa crocante", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Ervas finas", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Pimenta-do-reino moída", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, null);

    // Bebidas Alcoólicas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Cerveja Long Neck",
        valor: "18.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Cerveja lager 330 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Taça de Vinho Tinto",
        valor: "35.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Vinho tinto 200 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Taça de Vinho Branco",
        valor: "30.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Vinho branco 200 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Caipirinha de Limão",
        valor: "28.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Cachaça, limão, açúcar, gelo.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mojito",
        valor: "30.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Rum, hortelã, limão, açúcar, água com gás.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Gin Tônica",
        valor: "32.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Gin, água tônica, limão, gelo.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Aperol Spritz",
        valor: "35.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Aperol, prosecco, água com gás, laranja.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Margarita",
        valor: "30.00",
        id_categoria: "6", // Bebidas Alcoólicas
        descricao: "Tequila, Cointreau, limão, sal, gelo.",
        adicionais: []
    }, null);

    // Bebidas Quentes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Café Expresso",
        valor: "8.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café moído, água.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Cappuccino",
        valor: "14.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, leite vaporizado, espuma de leite.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chocolate Quente",
        valor: "12.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Leite, chocolate em pó, açúcar, chantilly (opcional).",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá de Camomila",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Flor de camomila, água, mel (opcional).",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá Verde",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Folhas de chá verde, água.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Latte",
        valor: "16.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, grande quantidade de leite vaporizado.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mocha",
        valor: "18.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, chocolate, leite vaporizado, chantilly.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá Preto",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Folhas de chá preto, água, limão ou açúcar (opcional).",
        adicionais: []
    }, null);

    // Refrigerantes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "CocaCola",
        valor: "8.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Refrigerante de cola 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Guaraná Antarctica",
        valor: "8.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Refrigerante de guaraná 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Fanta Laranja",
        valor: "8.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Refrigerante sabor laranja 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sprite",
        valor: "8.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Refrigerante limão 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Schweppes Citrus",
        valor: "12.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Água tônica com infusão cítrica 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Ginger Ale",
        valor: "12.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Refrigerante de gengibre 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Soda Limão",
        valor: "8.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Água com gás sabor limão 350 ml.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Água Tônica",
        valor: "12.00",
        id_categoria: "8", // Refrigerantes
        descricao: "Água tônica 350 ml.",
        adicionais: []
    }, null);

    // Sucos
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Laranja",
        valor: "12.00",
        id_categoria: "9", // Sucos
        descricao: "Laranja espremida, água, açúcar (opcional).",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Limão",
        valor: "10.00",
        id_categoria: "9", // Sucos
        descricao: "Limão espremido, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Maracujá",
        valor: "14.00",
        id_categoria: "9", // Sucos
        descricao: "Polpa de maracujá, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Abacaxi com Hortelã",
        valor: "16.00",
        id_categoria: "9", // Sucos
        descricao: "Abacaxi, folhas de hortelã, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Manga",
        valor: "14.00",
        id_categoria: "9", // Sucos
        descricao: "Manga, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Melancia",
        valor: "12.00",
        id_categoria: "9", // Sucos
        descricao: "Melancia, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Morango",
        valor: "14.00",
        id_categoria: "9", // Sucos
        descricao: "Morangos, água, açúcar.",
        adicionais: []
    }, null);

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco Verde",
        valor: "16.00",
        id_categoria: "9", // Sucos
        descricao: "Couve, maçã, limão, água, gengibre (opcional).",
        adicionais: []
    }, null);

}

async function criarFuncionarios () {
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"1", id_cargo:1, nome:"ADM", telefone:"9911111111", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"2", id_cargo:2, nome:"Atendente", telefone:"9922222222", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"3", id_cargo:3, nome:"Garçom", telefone:"9933333333", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"4", id_cargo:4, nome:"Gerente", telefone:"9944444444", imagePath:null});
}

function downloadImageAsBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
  
      client.get(url, (res) => {
        const data: Uint8Array[] = [];
  
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
        res.on('error', reject);
      }).on('error', reject);
    });
  }