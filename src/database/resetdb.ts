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
    
        await criarFuncionarios();
        await criarItens();

        console.log("# Banco de dados resetado com sucesso");
    } catch (err : any) {
        console.error("# Erro ao resetar banco de dados: ", err);
        
    }
}

async function criarItens () {
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Bruschetta",
        valor: "28",
        id_categoria: "5",
        descricao: "Pão italiano fatiado, tomate, manjericão, alho, azeite, sal.",
        adicionais: [
          { nome: "Queijo de cabra", valor: "8", id_itemcardapio: -1 },
          { nome: "Presunto cru", valor: "10", id_itemcardapio: -1 },
          { nome: "Pesto de manjericão", valor: "7", id_itemcardapio: -1 }
    ]}, await downloadImageAsBuffer("https://media.istockphoto.com/id/481765835/photo/homemade-italian-bruschetta-appetizer.jpg?s=612x612&w=0&k=20&c=20lme_vcpR4R2wfNyAFwvglvSj3mxJU9qel00LqzP3I="))
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
    }, await downloadImageAsBuffer("https://s2-receitas.glbimg.com/_GkYC8FQvE7JNZoILsLV7BvmD-I=/0x0:1000x750/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/t/d/W4TOLSQxAXiLig8w82IA/batata-frita-sequinha.jpg"));
    
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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGltgjkEFSSOneqB84fZckePP2UX0KpP6Yag&s"));
    
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
    }, await downloadImageAsBuffer("https://bakeandcakegourmet.com.br/uploads/site/receitas/bolinho-de-bacalhau-ac21obso.jpg"));
    
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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSNmIxhI8itZWuxeSg4aDGAGIqeb50Yoh3AQ&s"));
    
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
    }, await downloadImageAsBuffer("https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/09734C43-23AE-426B-9BC8-F934A6FA6438/Derivates/1c00f1d4-d01b-47e9-ba4a-64d5589fdaaf.jpg"));
    
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
    }, await downloadImageAsBuffer("https://s2.glbimg.com/6E3iz0EhZMGDszkjVzeF6dOMk44=/620x650/e.glbimg.com/og/ed/f/original/2016/08/29/espetinho-de-camarao-com-pure-de-grao-de-bico-54aopontotrintaminutos11154702_11154711_6627.jpg"));
    
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
    }, await downloadImageAsBuffer("https://zimbrooficial.com.br/wp-content/uploads/2022/07/palito-muss.png"));

    // Saladas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Caesar",
        valor: "45.00",
        id_categoria: "3", // Saladas
        descricao: "Alface romana, croutons, parmesão, molho Caesar.",
        adicionais: [
            { nome: "Frango grelhado", valor: "12.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Ovo de codorna", valor: "7.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://receitatodahora.com.br/wp-content/uploads/2023/05/salada-caesar-27-04-800x800.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Caprese",
        valor: "52.00",
        id_categoria: "3", // Saladas
        descricao: "Tomate, muçarela de búfala, manjericão, azeite, sal.",
        adicionais: [
            { nome: "Pesto de manjericão", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Pepino laminado", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Azeite trufado", valor: "10.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://i0.wp.com/canaldareceita.com.br/wp-content/uploads/2024/11/SALADA-CAPRESE.jpg?fit=1000%2C600&ssl=1"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Grega",
        valor: "50.00",
        id_categoria: "3", // Saladas
        descricao: "Pepino, tomate, cebola roxa, azeitonas, queijo feta, orégano, azeite.",
        adicionais: [
            { nome: "Pimentão assado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Grão-de-bico", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Hortelã fresca", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://painacozinha.com/wp-content/uploads/56.Salada-grega-autentica-1.webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mix de Folhas com Tomate e Pepino",
        valor: "40.00",
        id_categoria: "3", // Saladas
        descricao: "Alface, rúcula, agrião, tomate-cereja, pepino, molho simples.",
        adicionais: [
            { nome: "Tomate seco", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Queijo de cabra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Sementes de girassol", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEjyHPPBcdogs4Ct5Q66t1YnoNj7NAD1TbxA&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Quinoa com Legumes",
        valor: "55.00",
        id_categoria: "3", // Saladas
        descricao: "Quinoa, cenoura, abobrinha, pimentão, ervas, azeite.",
        adicionais: [
            { nome: "Castanhas", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Queijo feta", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Tomate-cereja extra", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://www.oitedi.com.br/_next/image?url=https%3A%2F%2Ftedi-production.s3.amazonaws.com%2Fcooking_recipes%2Ffood_description%2Fcc427f5ed3255982a2d63a8f5b3859ad9e299cee.png&w=1080&q=70"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Beterraba com Laranja",
        valor: "45.00",
        id_categoria: "3", // Saladas
        descricao: "Beterraba cozida, laranja em gomos, rúcula, nozes, azeite.",
        adicionais: [
            { nome: "Queijo de cabra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Gergelim torrado", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Raspas de limão", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://escolavegana.com/wp-content/uploads/2024/07/Salada-de-Beterraba-com-Laranja-Vegana-e-Sem-Gluten-CANVAX-1.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada de Tomate com Manjericão",
        valor: "42.00",
        id_categoria: "3", // Saladas
        descricao: "Tomate fatiado, manjericão, azeite, sal, pimenta.",
        adicionais: [
            { nome: "Muçarela de búfala", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Azeitonas pretas", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Redução de balsâmico", valor: "7.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://i.panelinha.com.br/i1/bk-5108-salada.webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Salada Waldorf",
        valor: "50.00",
        id_categoria: "3", // Saladas
        descricao: "Maçã, uva, aipo, maionese, iogurte natural.",
        adicionais: [
            { nome: "Nozes", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Passas", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Salsão crocante", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://www.receiteria.com.br/wp-content/uploads/salada-waldorf-1.jpeg"));

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
    }, await downloadImageAsBuffer("https://24698e6a.delivery.rocketcdn.me/wp-content/uploads/2021/02/como-fazer-sopa-de-legumes-historia-do-prato-receitas-deliciosas.jpg"));

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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ12oqJhr0ZueqdCZKo33wtOdC59XiBr5W2GA&s"));

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
    }, await downloadImageAsBuffer("https://images.tcdn.com.br/img/img_prod/691079/canja_de_galinha_caipira_471_1_b4e07f4d804c79c8337d6159d849c244.jpg"));

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
    }, await downloadImageAsBuffer("https://www.estadao.com.br/resizer/v2/ACS5UUSSZRCBXOS7UNZFJTO4JY.jpg?quality=80&auth=dec429c40b8d407a7347bb630636f2f7b1fcb72b387d80a3374c9b3c49a096e3&width=720&height=503&focal=1751,959"));

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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfSuq1HUnSrQRQWxpxkN7W_QR8UHLFif7XrQ&s"));

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
    }, await downloadImageAsBuffer("https://receitadaboa.com.br/wp-content/uploads/2024/09/iStock-541305426.jpg"));

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
    }, await downloadImageAsBuffer("https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/0479C591-7801-440B-B7B6-0E787B426845/Derivates/3359269A-965F-40D5-8F2C-EBEFCB39A3E1.jpg"));

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
    }, await downloadImageAsBuffer("https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/3710E455-33FC-4CC7-97B2-C8C902B697CD/Derivates/81c54342-038a-43a5-a02d-01c8ad36e72e.jpg"));

    // Aves
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Peito de Frango Grelhado com Ervas",
        valor: "75.00",
        id_categoria: "9", // Aves
        descricao: "Peito de frango, alecrim, tomilho, azeite, alho, sal.",
        adicionais: [
            { nome: "Queijo derretido", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Molho de mostarda", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Mix de pimentas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://organicsnewsbrasil.com.br/wp-content/uploads/2018/10/Peito-de-Frango-Assado-com-Ervas.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango à Passarinho",
        valor: "70.00",
        id_categoria: "9", // Aves
        descricao: "Pedaços de frango, alho, limão, sal, óleo.",
        adicionais: [
            { nome: "Molho vinagrete", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Farofa temperada", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Páprica doce", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://www.receiteria.com.br/wp-content/uploads/frango-a-passarinho-capa.png"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Filé de Frango Empanado",
        valor: "75.00",
        id_categoria: "9", // Aves
        descricao: "Filé de frango, ovo, farinha de rosca, farinha de trigo, sal.",
        adicionais: [
            { nome: "Molho tártaro", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pimenta calabresa", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9d5PRmh6A5i8dQeFdmiXE5a0NiH_JX3bKag&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Espetinho de Frango",
        valor: "72.00",
        id_categoria: "9", // Aves
        descricao: "Cubos de frango, azeite, sal, temperos.",
        adicionais: [
            { nome: "Molho barbecue", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Cebola caramelizada", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Farofa crocante", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-2idnqD85WAOqCK_3wesCnH2HutBzXsNMA&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Strogonoff de Frango",
        valor: "78.00",
        id_categoria: "9", // Aves
        descricao: "Frango, creme de leite, molho de tomate, champignon, cebola.",
        adicionais: [
            { nome: "Batata palha extra", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Shimeji salteado", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Cogumelos frescos", valor: "8.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKeBtX4zI1JLP2aAIphILcQgZsQY3_b2d6Uw&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango ao Molho de Mostarda",
        valor: "85.00",
        id_categoria: "9", // Aves
        descricao: "Peito de frango, creme de leite, mostarda, cebola, sal.",
        adicionais: [
            { nome: "Mel", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Nozes picadas", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Salsa fresca", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQirs10T-5T_saqAlEXbe5m3zb8OMJm0-g7w&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Frango ao Curry",
        valor: "85.00",
        id_categoria: "9", // Aves
        descricao: "Frango, curry, leite de coco, cebola, alho, coentro.",
        adicionais: [
            { nome: "Gengibre fresco", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Coentro extra", valor: "4.00", id_itemcardapio: -1 },
            { nome: "Amêndoas tostadas", valor: "8.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdo0di8N3VPD_AeGuViBu1OfHa_KJaemjgPQ&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sanduíche de Frango Desfiado",
        valor: "48.00",
        id_categoria: "9", // Aves
        descricao: "Pão brioche, frango desfiado, maionese, alface, tomate.",
        adicionais: [
            { nome: "Queijo cheddar", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Picles", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://swiftbr.vteximg.com.br/arquivos/sanduiche-de-frango-desfiado.jpg"));

    // Carnes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Bife Acebolado",
        valor: "95.00",
        id_categoria: "6", // Carnes
        descricao: "Bife bovino, cebola, alho, azeite, sal, pimenta.",
        adicionais: [
            { nome: "Cebolas caramelizadas", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Queijo gorgonzola", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Mix de pimentas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://www.receitasja.com.br/wp-content/uploads/2025/03/bife-acebolado.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Picanha Grelhada",
        valor: "150.00",
        id_categoria: "6", // Carnes
        descricao: "Picanha, sal grosso, azeite.",
        adicionais: [
            { nome: "Chimichurri", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Farofa miúda", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Vinagrete", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://maiscarnesuina.com.br/wp-content/uploads/2015/09/Bife-de-picanha01-750x501.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Filé Mignon ao Alho",
        valor: "180.00",
        id_categoria: "6", // Carnes
        descricao: "Filé mignon, alho, manteiga, sal, pimenta.",
        adicionais: [
            { nome: "Batata rústica", valor: "10.00", id_itemcardapio: -1 },
            { nome: "Manteiga especial", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Ervas finas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://i.ytimg.com/vi/f8ijVVw2CxA/sddefault.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Strogonoff de Carne",
        valor: "120.00",
        id_categoria: "6", // Carnes
        descricao: "Carne em tiras, creme de leite, molho de tomate, champignon.",
        adicionais: [
            { nome: "Batata palha extra", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Cogumelos frescos", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Creme de leite extra", valor: "6.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://tradicaoditalia.com.br/loja/wp-content/uploads/2024/06/c7ed2583-76b3-4cf9-8625-33dc0762efa1-Strogonoff-de-carne-gallery-0.jpeg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Kafta de Carne Bovina",
        valor: "85.00",
        id_categoria: "6", // Carnes
        descricao: "Carne moída, cebola, alho, hortelã, especiarias, palito.",
        adicionais: [
            { nome: "Coalhada seca", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pão sírio", valor: "5.00", id_itemcardapio: -1 },
            { nome: "Pimenta síria", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://swiftbr.vteximg.com.br/arquivos/ids/203517-768-768/617747-espetinho-de-kafta_3.jpg.jpg?v=638731458642400000"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Almôndegas ao Molho",
        valor: "80.00",
        id_categoria: "6", // Carnes
        descricao: "Carne moída, ovo, farinha de rosca, molho de tomate, ervas.",
        adicionais: [
            { nome: "Purê de batata", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Parmesão ralado", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Ervas aromáticas", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://www.receitasja.com.br/wp-content/uploads/2024/10/almondegas.webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Carne de Panela com Legumes",
        valor: "90.00",
        id_categoria: "6", // Carnes
        descricao: "Carne em cubos, cenoura, batata, cebola, caldo, temperos.",
        adicionais: [
            { nome: "Arroz branco", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Farofa caseira", valor: "7.00", id_itemcardapio: -1 },
            { nome: "Cebolinha", valor: "4.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://i.panelinha.com.br/i1/228-bk-2979-carne-de-panela-com-cenoura-e-batata-na-pressao.webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Escondidinho de Carne Seca",
        valor: "110.00",
        id_categoria: "6", // Carnes
        descricao: "Purê de mandioca, carne seca desfiada, queijo, manteiga.",
        adicionais: [
            { nome: "Queijo gratinado extra", valor: "8.00", id_itemcardapio: -1 },
            { nome: "Bacon crocante", valor: "6.00", id_itemcardapio: -1 },
            { nome: "Pimenta biquinho", valor: "5.00", id_itemcardapio: -1 }
        ]
    }, await downloadImageAsBuffer("https://bakeandcakegourmet.com.br/uploads/site/receitas/escondidinho-de-carne-seca-tradicional-2-y3phcqq9.jpg"));

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
    }, await downloadImageAsBuffer("https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-espaguete-ao-sugo.jpg?quality=70&strip=info&w=620&h=372&crop=1?crop=1&resize=1212,909"));

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
    }, await downloadImageAsBuffer("https://i0.wp.com/blogdocheftaico.com/wp-content/uploads/2022/06/Penne-ao-molho-Alfredo.png?fit=800%2C533&ssl=1"));

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
    }, await downloadImageAsBuffer("https://i0.wp.com/vitalatman.com.br/blog/wp-content/uploads/2013/05/Talharim-ao-pesto-Brasileiro-1.jpg?fit=1000%2C667&ssl=1"));

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
    }, await downloadImageAsBuffer("https://lh5.googleusercontent.com/proxy/5U8OBw8Yh_6r4zzS-aislr6LN4tW5fI-lDzE_jNJLNfUm1eSbUAEto_i1XySgMOVuEHY0IYjFZXbxoooZ2Qvth3kXxrmXVum8AuGh4r5bzFbr4AT7PMXg7G_GYKA89rpD0Q06FWKkXd6NVoJ"));

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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWk8rlFj5wBfdUoiVv3je9Ab4ftD_GrybJ3g&s"));

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
    }, await downloadImageAsBuffer("https://www.cozinhadonabenta.com.br/wp-content/uploads/2020/09/NHOQUE-DE-BATATA.jpg"));

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
    }, await downloadImageAsBuffer("https://guiadacozinha.com.br/wp-content/uploads/2019/10/canelone-espinafre-ricota-1.jpg"));

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
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrF4jyzp4ggpXAm2gZepZA21-0DFogdaNNVQ&s"));

    // Bebidas Alcoólicas
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Cerveja Long Neck",
        valor: "18.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Cerveja lager 330 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQ2nPnkfVC8Nz44YNSS0ukIWjynO2m1YJAQ&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Taça de Vinho Tinto",
        valor: "35.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Vinho tinto 200 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWmmhyWX-YvFFeCk8Kal6M7CEjmb6rejkZoA&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Taça de Vinho Branco",
        valor: "30.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Vinho branco 200 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://cdn.sistemawbuy.com.br/arquivos/68be35aafa5fa13a036ffd536c19d495/produtos/6686a9fc82126/vk9ygxyg-668af0ce2fff2.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Caipirinha de Limão",
        valor: "28.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Cachaça, limão, açúcar, gelo.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQZFh6i35aadEZghdxQ3aX8_k7igkUGfq0Gw&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mojito",
        valor: "30.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Rum, hortelã, limão, açúcar, água com gás.",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.saveur.com/uploads/2007/02/SAVEUR_Mojito_1149-Edit-scaled.jpg?auto=webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Gin Tônica",
        valor: "32.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Gin, água tônica, limão, gelo.",
        adicionais: []
    }, await downloadImageAsBuffer("https://blog.biglar.com.br/wp-content/uploads/2021/12/iStock-1310029561.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Aperol Spritz",
        valor: "35.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Aperol, prosecco, água com gás, laranja.",
        adicionais: []
    }, await downloadImageAsBuffer("https://hips.hearstapps.com/hmg-prod/images/aperol-spritz-index-64873f08af990.jpg?crop=0.503xw:1.00xh;0.225xw,0&resize=1200:*"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Margarita",
        valor: "30.00",
        id_categoria: "8", // Bebidas Alcoólicas
        descricao: "Tequila, Cointreau, limão, sal, gelo.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEfi-vrPt3mrLT_cnv0rm2QmncXErIjHifA&s"));

    // Bebidas Quentes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Café Expresso",
        valor: "8.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café moído, água.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStJZWscibogHVjl7XsMsEFsWJaLMBbU0lZHw&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Cappuccino",
        valor: "14.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, leite vaporizado, espuma de leite.",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.nescafe.com/br/sites/default/files/2024-09/NES_SBU_Recipes%202024_Website_French%20Vanilla%20Cappuccino_Step%206_705x830.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chocolate Quente",
        valor: "12.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Leite, chocolate em pó, açúcar, chantilly (opcional).",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.mococa.com.br/wp-content/uploads/2022/03/2313456.png"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá de Camomila",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Flor de camomila, água, mel (opcional).",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7H8Y5gJN3WmImamgYPMvG1zMORQcqpkbN3Q&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá Verde",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Folhas de chá verde, água.",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.peterpaiva.com.br/wp-content/uploads/2023/04/cc-Blogs-02.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Latte",
        valor: "16.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, grande quantidade de leite vaporizado.",
        adicionais: []
    }, await downloadImageAsBuffer("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Caffe_Latte_at_Pulse_Cafe.jpg/1200px-Caffe_Latte_at_Pulse_Cafe.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Mocha",
        valor: "18.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Café expresso, chocolate, leite vaporizado, chantilly.",
        adicionais: []
    }, await downloadImageAsBuffer("https://images.immediate.co.uk/production/volatile/sites/2/2021/11/Mocha-1fc71f7.png?quality=90&resize=556,505"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Chá Preto",
        valor: "10.00",
        id_categoria: "7", // Bebidas Quentes
        descricao: "Folhas de chá preto, água, limão ou açúcar (opcional).",
        adicionais: []
    }, await downloadImageAsBuffer("https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3125538:1629481453/Cha-preto.jpg?f=default&$p$f=61cbeb7"));

    // Refrigerantes
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Coca-Cola",
        valor: "8.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Refrigerante de cola 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaL7qFZHlmDirRtHCks4sbTgt21u2eXjITpA&"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Guaraná Antarctica",
        valor: "8.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Refrigerante de guaraná 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73fVEk2vCmaeYfyYikfZl_-buLooK6jIC_w&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Fanta Laranja",
        valor: "8.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Refrigerante sabor laranja 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://mercantilnovaera.vtexassets.com/arquivos/ids/211972/Refrigerante-Fanta-Laranja-350ml.png?v=638340079499000000"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Sprite",
        valor: "8.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Refrigerante limão 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPVBUsGNkVrtzLc_a6CpGl9-_6BxUUimIJig&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Schweppes Citrus",
        valor: "12.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Água tônica com infusão cítrica 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://espacoprime.fbitsstatic.net/img/p/schweppes-citrus-original-350ml-70181/256694-1.jpg?w=200&h=200&v=no-change&qs=ignore"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Ginger Ale",
        valor: "12.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Refrigerante de gengibre 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCyNr5CtgB3pB1x42HpXhRIT_kpw0vup7Ybg&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Soda Limão",
        valor: "8.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Água com gás sabor limão 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.varanda.com.br/media/tmp/webp/catalog/product/cache/1/image/855x/9df78eab33525d08d6e5fb8d27136e95/r/e/ref-soda-ant-lt-355m-7891991000833_1.webp"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Água Tônica",
        valor: "12.00",
        id_categoria: "4", // Refrigerantes
        descricao: "Água tônica 350 ml.",
        adicionais: []
    }, await downloadImageAsBuffer("https://bretas.vtexassets.com/arquivos/ids/201506-800-auto?v=638376352003200000&width=800&height=auto&aspect=true"));

    // Sucos
    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Laranja",
        valor: "12.00",
        id_categoria: "1", // Sucos
        descricao: "Laranja espremida, água, açúcar (opcional).",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIdXJ1wuzIxz7FZnRI8uXcGgTHQv3LdiWluQ&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Limão",
        valor: "10.00",
        id_categoria: "1", // Sucos
        descricao: "Limão espremido, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://www.sabornamesa.com.br/media/k2/items/cache/1f9467ed0ebd32e9dc822d63c55d5401_XL.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Maracujá",
        valor: "14.00",
        id_categoria: "1", // Sucos
        descricao: "Polpa de maracujá, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://pedidos.nacanoa.com.br/wp-content/uploads/2020/09/Suco-Maracuja.png"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Abacaxi com Hortelã",
        valor: "16.00",
        id_categoria: "1", // Sucos
        descricao: "Abacaxi, folhas de hortelã, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkoZ7a83lkDdGdjWIOtdGyRwYxnzxdYjxcnQ&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Manga",
        valor: "14.00",
        id_categoria: "1", // Sucos
        descricao: "Manga, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://guiadacozinha.com.br/wp-content/uploads/2004/01/tamanho-padrao-gc-54.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Melancia",
        valor: "12.00",
        id_categoria: "1", // Sucos
        descricao: "Melancia, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaaZvaoHt1j92sTemJTEn8ILP2hnKoxr_mVw&s"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco de Morango",
        valor: "14.00",
        id_categoria: "1", // Sucos
        descricao: "Morangos, água, açúcar.",
        adicionais: []
    }, await downloadImageAsBuffer("https://s2-receitas.glbimg.com/nUoNlHBDl8lHba8CuQej1ecELWw=/0x0:199x254/984x0/smart/filters:strip_icc()/s.glbimg.com/po/rc/media/2013/04/28/23_37_03_588_suco_morango.jpg"));

    await ItemCardapioService.salvarItemCardapio({
        id_itemcardapio: -1,
        nome: "Suco Verde",
        valor: "16.00",
        id_categoria: "1", // Sucos
        descricao: "Couve, maçã, limão, água, gengibre (opcional).",
        adicionais: []
    }, await downloadImageAsBuffer("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG5pc-mciGi409fDzqo-FBrpeYdV2X4BC13g&s"));

}

async function criarFuncionarios () {
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"1", id_cargo:1, nome:"ADM", telefone:"9911111111", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"2", id_cargo:2, nome:"Atendente", telefone:"9922222222", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"3", id_cargo:3, nome:"Garçom", telefone:"9933333333", imagePath:null});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"4", id_cargo:4, nome:"Gerente", telefone:"9944444444", imagePath:null});
}

function downloadImageAsBuffer(url: string): Promise<Buffer>|null {
    if (!url) {
        return null;
    }

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