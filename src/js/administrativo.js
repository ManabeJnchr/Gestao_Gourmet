window.Cardapio = function () {
    return {
        tela: 'GER',
        registro: { id_itemcardapio: -1, nome: '', valor: '', id_categoria: '', descricao: '', imagem: '', adicionais: [] },
        categorias: [],
        dados: [],
        dadoSelecionado: [],
        idItemParaExcluir: '',
        buscarDados() {
            axios.get('/listarCardapio')
                .then(resp => {
                    this.dados = resp.data.map(dado => ({
                        ...dado,
                        imagem: dado.imagem ? `/uploads/${dado.imagem}` : null
                    }));
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao listar cardápio.', 'danger');
                    console.log(error);
                })
                .finally(function () {

                });
        },
        buscarCategorias() {
            axios.get('/listarCategorias')
                .then(resp => {
                    this.categorias = resp.data;
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao listar categorias.', 'danger');
                    console.log(error);
                })
                .finally(function () {

                });
        },
        salvarRegistro() {
            const formData = new FormData();
            const fileInput = document.getElementById('input_img');

            // Só adiciona o arquivo se o usuário selecionou um novo
            if (fileInput && fileInput.files && fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }

            // Não envie a propriedade imagem se não for nova
            const registroParaEnviar = { ...this.registro };
            delete registroParaEnviar.imagem; // Remova a propriedade imagem

            formData.append('registro', JSON.stringify(registroParaEnviar));

            axios.post('/salvarItemCardapio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(resp => {
                    this.buscarDados();
                    this.limparRegistro();
                    this.tela = 'GER';
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao salvar item de cardápio.', 'danger');
                    console.log(error);
                })
                .finally(() => {

                });
        },
        deletarRegistro(_id) {
            axios.post('/deletarItemCardapio', { id_itemcardapio: _id })
                .then(resp => {
                    if (resp.data == -1) {
                        this.buscarDados();
                    }
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao deletar item de cardápio.', 'danger');
                    console.log(error);
                });
        },
        editarRegistro(index) {
            // Preencha os campos normalmente, mas NÃO coloque imagem base64 no registro
            this.registro.id_itemcardapio = this.dados[index].id_itemcardapio;
            this.registro.nome = this.dados[index].nome;
            this.registro.valor = this.dados[index].valor;
            this.registro.id_categoria = this.dados[index].id_categoria;
            this.registro.adicionais = this.dados[index].adicionais;
            this.registro.descricao = this.dados[index].descricao;
            this.registro.imagem = ''; // Limpe o campo imagem

            // Atualize a imagem visualmente
            const selectedImage = document.getElementById("selectedImage");
            selectedImage.src = this.dados[index].imagemBase64 || '/src/img/add-item-cardapio-icon.jpg';

            // Limpe o input de arquivo
            const fileInput = document.getElementById('input_img');
            if (fileInput) fileInput.value = '';
        },
        limparRegistro() {
            this.registro = { id_itemcardapio: -1, nome: '', valor: '', descricao: '', id_categoria: '', imagem: '', adicionais: [] };
            // Limpe a imagem visual
            const selectedImage = document.getElementById("selectedImage");
            if (selectedImage) selectedImage.src = '/src/img/add-item-cardapio-icon.jpg';
            // Limpe o input de arquivo
            const fileInput = document.getElementById('input_img');
            if (fileInput) fileInput.value = '';
        },
        incluirAdicional() {
            if (!this.registro.adicionais) {
                this.registro.adicionais = [];
            }
            this.registro.adicionais.push({ id_adicional: -1, id_itemcardapio: this.registro.id_itemcardapio, nome: '', valor: '' });
        },
        excluirAdicional(index) {
            this.registro.adicionais.splice(index, 1);
        },
    }
}

window.Funcionarios = function () {
    return {
        id_funcionario: '',
        tela: 'GER',
        registro: { id_funcionario: -1, nome: '', cpf: '', telefone: '', id_cargo: '' },
        dados: [],
        dadoSelecionado: [],
        idFuncionarioParaExcluir: '',
        buscarDados() {
            this.getFuncionario();
            axios.get('/listarFuncionarios')
                .then(resp => {
                    this.dados = resp.data.map(dado => ({
                        ...dado,
                        imagem: dado.imagem ? `/uploads/${dado.imagem}` : null
                    }));
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao listar funcionários.', 'danger');
                    console.log(error);
                });
        },
        salvarRegistro() {
            if (!validarCPF(this.registro.cpf)) {
                showToast('CPF inválido. Por favor, insira um CPF válido.', 'danger');
                return;
            }

            const formData = new FormData();
            const fileInput = document.getElementById('input_img');
            if (fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }
            formData.append('nome', this.registro.nome);
            formData.append('cpf', this.registro.cpf);
            formData.append('telefone', this.registro.telefone);
            formData.append('id_cargo', this.registro.id_cargo);
            formData.append('id_funcionario', this.registro.id_funcionario);

            axios.post('/salvarFuncionario', formData)
                .then(resp => {
                    if (resp.data.erro || resp.data.message) {
                        const errorMessage = resp.data.erro?.message || resp.data.message || 'Erro desconhecido.';
                        showToast(errorMessage, 'danger');
                    } else {
                        this.buscarDados();
                        this.limparRegistro();
                        this.tela = 'GER';
                        showToast('Funcionário salvo com sucesso!', 'success');
                    }
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao salvar funcionário.', 'danger');
                    console.log(error);
                });
        },
        deletarRegistro(id) {
            const funcionario = this.dados.find(f => f.id_funcionario === id);

            if (this.id_funcionario == funcionario.id_cargo) {
                showToast('Gerente não pode deletar um administrador.', 'danger');
                return;
            }

            axios.post('/deletarFuncionario', { id_funcionario: id })
                .then(resp => {
                    if (resp.data == -1) {
                        this.buscarDados();
                        showToast('Funcionário deletado com sucesso!', 'success');
                    } else if (resp.data.erro || resp.data.message) {
                        const errorMessage = resp.data.erro?.message || resp.data.message || 'Erro desconhecido.';
                        showToast(errorMessage, 'danger');
                    }
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao deletar funcionários.', 'danger');
                    console.log(error);
                });
        },
        editarRegistro(index) {
            this.registro.id_funcionario = this.dados[index].id_funcionario;
            this.registro.nome = this.dados[index].nome;
            this.registro.cpf = this.dados[index].cpf;
            this.registro.telefone = this.dados[index].telefone;
            this.registro.id_cargo = this.dados[index].id_cargo;
            this.registro.imagem = this.dados[index].imagem ? this.dados[index].imagem : null;
            document.getElementById("selectedImage").src = this.registro.imagem || '../src/img/user-icon-placeholder.jpg';
            document.getElementById("input_img").value = '';
        },
        getFuncionario() {
            axios.get('/identity').then(resp => {
                this.pedido.id_funcionario = resp.data.id_funcionario;
                this.id_funcionario = resp.data.id_funcionario;
            })
            .catch(error => {
                showToast(error.response?.data?.erro || 'Erro ao buscar funcionário.', 'danger');
                console.log(error);
            });
        },
        limparRegistro() {
            this.registro = { id_funcionario: -1, nome: '', cpf: '', telefone: '', id_cargo: '' };
            document.getElementById("selectedImage").src = '../src/img/user-icon-placeholder.jpg';
            document.getElementById("input_img").value = '';
        },
    }
}

window.Mesas = function () {
    return {
        tela: 'GER',
        registro: { id_mesa: -1, numero_mesa: '', qtd_lugares: '', id_status: 4 },
        dados: [],
        dadoSelecionado: [],
        idMesaParaExcluir: '',
        buscarDados() {
            axios.get('/listarMesas')
                .then(resp => {
                    this.dados = resp.data;
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao listar mesas.', 'danger');
                    console.log(error);
                });
        },
        salvarRegistro() {
            axios.post('/salvarMesa', this.registro)
                .then(resp => {
                    this.buscarDados();
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao salvar mesa.', 'danger');
                    console.log(error);
                });
        },
        deletarRegistro(id_mesa) {
            axios.post('/deletarMesa', { id_mesa: id_mesa })
                .then(resp => {
                    if (resp.data == -1) {
                        this.buscarDados();
                    }
                })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao deletar mesa.', 'danger');
                    console.log(error);
                });
        },
        editarRegistro(index) {
            this.registro.id_mesa = this.dados[index].id_mesa;
            this.registro.numero_mesa = this.dados[index].numero_mesa;
            this.registro.qtd_lugares = this.dados[index].qtd_lugares;
            this.registro.id_status = this.dados[index].id_status;
        },
        limparRegistro() {
            this.registro = { id_mesa: -1, numero_mesa: '', qtd_lugares: '', id_status: 4 };
        }
    }
}