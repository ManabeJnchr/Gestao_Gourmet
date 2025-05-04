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
}

async function criarFuncionarios () {
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"1", id_cargo:1, nome:"ADM", telefone:"9911111111", imagePath:""});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"2", id_cargo:2, nome:"Atendente", telefone:"9922222222", imagePath:""});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"3", id_cargo:3, nome:"Garçom", telefone:"9933333333", imagePath:""});
    await FuncionarioService.salvarFuncionario({id_funcionario:-1, cpf:"4", id_cargo:4, nome:"Gerente", telefone:"9944444444", imagePath:""});
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