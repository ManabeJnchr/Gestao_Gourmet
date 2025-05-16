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
                    console.log(error);
                })
                .finally(function () {

                });
        },
        salvarRegistro() {
            const formData = new FormData();
            const fileInput = document.getElementById('input_img') || document.getElementById('selectedImage');

            if (fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            }
            formData.append('registro', JSON.stringify(this.registro));

            axios.post('/salvarItemCardapio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(resp => {
                    console.log(resp.data);
                    this.buscarDados();
                    this.limparRegistro();
                    this.tela = 'GER';
                })
                .catch(error => {

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
                    console.log(error);
                });
        },
        editarRegistro(index) {
            this.registro.id_itemcardapio = this.dados[index].id_itemcardapio;
            this.registro.nome = this.dados[index].nome;
            this.registro.valor = this.dados[index].valor;
            this.registro.id_categoria = this.dados[index].id_categoria;
            this.registro.imagem = this.dados[index].imagemBase64;
            this.registro.adicionais = this.dados[index].adicionais;
            this.registro.descricao = this.dados[index].descricao;
        },
        limparRegistro() {
            this.registro = { id_itemcardapio: -1, nome: '', valor: '', descricao: '', id_categoria: '', imagem: '', adicionais: [] };
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
        tela: 'GER',
        registro: { id_funcionario: -1, nome: '', cpf: '', telefone: '', id_cargo: '' },
        dados: [],
        dadoSelecionado: [],
        idFuncionarioParaExcluir: '',
        buscarDados() {
            axios.get('/listarFuncionarios')
                .then(resp => {
                    this.dados = resp.data.map(dado => ({
                        ...dado,
                        imagem: dado.imagem ? `/uploads/${dado.imagem}` : null
                    }));
                })
                .catch(error => {
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
                    const errorMessage = error.response?.data?.erro?.message || error.response?.data?.message || 'Erro ao salvar funcionário.';
                    showToast(errorMessage, 'danger');
                });
        },
        deletarRegistro(id) {
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
                    const errorMessage = error.response?.data?.erro?.message || error.response?.data?.message || 'Erro ao deletar funcionário.';
                    showToast(errorMessage, 'danger');
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
                    console.log(error);
                });
        },
        salvarRegistro() {
            axios.post('/salvarMesa', this.registro)
                .then(resp => {
                    this.buscarDados();
                })
                .catch(error => {
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