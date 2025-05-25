window.Auth = function () {
    return {
        identity: { cargonome: '', cpf: '', funcionario_cpf: '', funcionarionome: '', id_cargo: '', imagem: '' },
        trocarSenha: { novaSenha: '', confirmarNovaSenha: '' },

        getIdentity(context = 'default') {
            axios.get('/identity').then(resp => {
                this.identity.cargonome = resp.data.cargonome;
                this.identity.cpf = resp.data.cpf;
                this.identity.funcionario_cpf = resp.data.funcionario_cpf;
                this.identity.funcionarionome = resp.data.funcionarionome;
                this.identity.id_cargo = resp.data.id_cargo;
                this.identity.imagem = `/uploads/${resp.data.imagem}`;

                if (this.identity.id_cargo == 1 || this.identity.id_cargo == 2 || this.identity.id_cargo == 3 || this.identity.id_cargo == 4) {
                    if (context === 'default') {
                        if (this.identity.id_cargo == 1 || this.identity.id_cargo == 4) {
                            document.getElementById('div_auth').classList.remove('d-none');
                        } else {
                            window.location.href = "/html/index.html";
                        }
                    } else if (context === 'pagamento') {
                        if (this.identity.id_cargo != 3) {
                            document.getElementById('div_auth').classList.remove('d-none');
                        } else {
                            window.location.href = "/html/index.html";
                        }
                    } else if (context === 'pedido') {
                        if (this.identity.id_cargo != 2) {
                            document.getElementById('div_auth').classList.remove('d-none');
                        } else {
                            window.location.href = "/html/index.html";
                        }
                    } else if (context === 'index') {
                        document.getElementById('div_auth').classList.remove('d-none');
                    }
                } else {
                    window.location.href = "/";
                }
            })
                .catch(error => {
                    console.log(error);
                });
        },
        getIdentityPagamento() {
            axios.get('/identity').then(resp => {
                this.identity.cargonome = resp.data.cargonome;
                this.identity.cpf = resp.data.cpf;
                this.identity.funcionario_cpf = resp.data.funcionario_cpf;
                this.identity.funcionarionome = resp.data.funcionarionome;
                this.identity.id_cargo = resp.data.id_cargo;
                this.identity.imagem = `/uploads/${resp.data.imagem}`;

                if (this.identity.id_cargo == 1 || this.identity.id_cargo == 2 || this.identity.id_cargo == 3 || this.identity.id_cargo == 4) {
                    if (this.identity.id_cargo != 3) {
                        document.getElementById('div_auth').classList.remove('d-none');
                    } else {
                        window.location.href = "/html/index.html";
                    }
                } else {
                    window.location.href = "/";
                }
            })
                .catch(error => {
                    console.log(error);
                });
        },
        getIdentityPedido() {
            axios.get('/identity').then(resp => {
                this.identity.cargonome = resp.data.cargonome;
                this.identity.cpf = resp.data.cpf;
                this.identity.funcionario_cpf = resp.data.funcionario_cpf;
                this.identity.funcionarionome = resp.data.funcionarionome;
                this.identity.id_cargo = resp.data.id_cargo;
                this.identity.imagem = `/uploads/${resp.data.imagem}`;

                if (this.identity.id_cargo == 1 || this.identity.id_cargo == 2 || this.identity.id_cargo == 3 || this.identity.id_cargo == 4) {
                    if (this.identity.id_cargo != 2) {
                        document.getElementById('div_auth').classList.remove('d-none');
                    } else {
                        window.location.href = "/html/index.html";
                    }
                } else {
                    window.location.href = "/";
                }
            })
                .catch(error => {
                    console.log(error);
                });
        },
        getIdentityIndex() {
            axios.get('/identity').then(resp => {
                this.identity.cargonome = resp.data.cargonome;
                this.identity.cpf = resp.data.cpf;
                this.identity.funcionario_cpf = resp.data.funcionario_cpf;
                this.identity.funcionarionome = resp.data.funcionarionome;
                this.identity.id_cargo = resp.data.id_cargo;
                this.identity.imagem = `/uploads/${resp.data.imagem}`;

                if (this.identity.id_cargo == 1 || this.identity.id_cargo == 2 || this.identity.id_cargo == 3 || this.identity.id_cargo == 4) {
                } else {
                    window.location.href = "/";
                }
                document.getElementById('div_auth').classList.remove('d-none');
            })
                .catch(error => {
                    console.log(error);
                });
        },
        logout() {
            axios.get('/logout').then(resp => {
                window.location.href = "/";
            })
                .catch(error => {
                    console.log(error);
                });
        },
        verificarNovaSenha() {
            if (this.trocarSenha.novaSenha.length < 6) {
                showToast('A nova senha deve ter pelo menos 6 caracteres.', 'danger');
                return;
            }
            if (this.trocarSenha.novaSenha !== this.trocarSenha.confirmarNovaSenha) {
                showToast('As senhas não coincidem.', 'danger');
                return;
            }
            if (!this.trocarSenha.novaSenha || !this.trocarSenha.confirmarNovaSenha) {
                showToast('Preencha todos os campos!', 'warning');
                return;
            }

            const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            if (changePasswordModal) {
                changePasswordModal.hide();
            }

            const confirmModal = new bootstrap.Modal(document.getElementById('confirmChangeModal'));
            confirmModal.show();
        },
        trocarSenhaAtual() {
            axios.post('/trocarSenha', {
                senha: this.trocarSenha.novaSenha
            }).then(resp => {
                showToast('Senha alterada com sucesso!', 'success');
                window.location.reload();
            }).catch(error => {
                showToast('Erro ao alterar a senha.', 'danger');
                console.log(error);
            });
        }
    }
}

window.Login = function () {
    return {
        registro: { cpf: '', senha: '' },
        cpf: '',
        efetuarLogin() {
            axios.post('/login', this.registro)
                .then(resp => {
                    if (resp.status == 200) {
                        window.location.href = '/html/index.html';
                    } else {
                        showToast('Login falhou!', 'danger');
                    }
                })
                .catch(error => {
                    console.log(error);
                    showToast('Ocorreu um erro ao tentar efetuar o login.', 'danger');
                });
        },
        solicitarResetSenha() {
            axios.post('/solicitarResetSenha', { cpf: this.cpf })
                .then(resp => {
                    if (resp.status == 200) {
                        showToast('Solicitação de redefinição de senha enviada com sucesso!', 'success');
                    } else {
                        showToast('Falha ao solicitar redefinição de senha!', 'danger');
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.erro) {
                        showToast(error.response.data.erro, 'danger');
                    } else {
                        showToast('Ocorreu um erro ao solicitar redefinição de senha.', 'danger');
                    }
                    console.log(error);
                });
        }
    }
}

window.RedifinicaoSenhaAdm = function () {
    return {
        dados: [],
        listarSolicitacoesResetSenha() {
            axios.get('/listarSolicitacoesResetSenha').then(resp => {
                this.dados = resp.data;
            }).catch(error => {
                console.log(error);
            });
        }, aceitarResetSenha(cpf) {
            axios.post('/aceitarResetSenha', { cpf: cpf }).then(resp => {
                this.listarSolicitacoesResetSenha();
            }).catch(error => {
                console.log(error);
            });
        }, recusarResetSenha(cpf) {
            axios.post('/recusarResetSenha', { cpf: cpf }).then(resp => {
                this.listarSolicitacoesResetSenha();
            }).catch(error => {
                console.log(error);
            });
        }
    }
}