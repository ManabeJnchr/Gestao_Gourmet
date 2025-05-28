window.EfetuarPedido = function () {
    return {
        adicionaisModal: [],
        adicionaisSelecionados: [],
        cardapio: [],
        cardapioFiltrado: [],
        categoriaSelecionada: '',
        id_funcionario: '',
        id_pedido: null,
        itemObservacaoAtual: null,
        mesas: [],
        pedido: {
            id_pedido: null,
            id_mesa: '',
            id_funcionario: null,
            observacao: '',
            itens: []
        },
        adicionarAoPedido(item) {
            const valorAdicionais = (item.adicionais || []).reduce((total, adicional) => total + (parseFloat(adicional.valor) || 0), 0);
            const valorTotal = (item.valor + valorAdicionais);

            const novoItem = {
                id_itempedido: null,
                id_itemcardapio: item.id_itemcardapio,
                nome: item.nome,
                quantidade: 1,
                valor: item.valor,
                observacao: '',
                imagemBase64: item.imagemBase64,
                adicionais: []
            };

            this.pedido.itens.push(novoItem);
        },
        adicionarNovoAdicional() {
            this.adicionaisModal.push({ id_adicional: "" });
        },
        buscarPedidoMesa(id_mesa) {
            if (id_mesa != "") {
                axios.post('/buscarPedidoMesa', { id_mesa: id_mesa }).then(resp => {
                    if (resp.data == null) {
                        this.pedido = {
                            id_pedido: null,
                            id_mesa: id_mesa,
                            id_funcionario: this.id_funcionario,
                            observacao: '',
                            itens: []
                        }
                    } else {
                        this.pedido.id_pedido = resp.data.id_pedido;
                        this.pedido.id_mesa = id_mesa;
                        this.pedido.observacao = resp.data.observacao || '';
                        this.pedido.itens = [];

                        resp.data.itens.forEach((item) => {
                            const novoItem = {
                                id_itempedido: item.id_itempedido,
                                id_itemcardapio: item.id_itemcardapio,
                                nome: item.nome,
                                quantidade: item.quantidade,
                                valor: item.valor,
                                observacao: item.observacao,
                                imagemBase64: item.imagemBase64,
                                adicionais: item.adicionais,
                            };
                            this.pedido.itens.push(novoItem);
                        });
                        showToast('Pedido carregado com sucesso!', 'success');
                    }
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao buscar pedido.', 'danger');
                });
            }
        },
        calcularValorTotal() {
            return this.pedido.itens.reduce((total, item) => {
                const itemCardapio = this.cardapio.find(cardapioItem => cardapioItem.id_itemcardapio === item.id_itemcardapio);

                if (itemCardapio) {
                    const valorAdicionais = (item.adicionais || []).reduce((soma, adicional) => {
                        const adicionalCardapio = itemCardapio.adicionais.find(a => a.id_adicional === parseInt(adicional.id_adicional));
                        return soma + (adicionalCardapio ? parseFloat(adicionalCardapio.valor) || 0 : 0);
                    }, 0);

                    const valorBase = parseFloat(itemCardapio.valor) || 0;
                    const valorItem = valorBase + valorAdicionais;
                    return total + (valorItem * (parseFloat(item.quantidade) || 1));
                }

                return total;
            }, 0).toFixed(2);
        },
        cancelarPedido() {
            if (this.pedido.id_pedido == null) {
                this.resetarPedido();
                showToast('Pedido cancelado com sucesso!', 'success');
                this.listarMesas();
            } else {
                axios.post('/cancelarPedido', { id_pedido: this.pedido.id_pedido }).then(resp => {
                    if (resp.data == true) {
                        this.resetarPedido();
                        showToast('Pedido cancelado com sucesso!', 'success');
                        this.listarMesas();
                    }
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao cancelar pedido.', 'danger');
                    console.log(error);
                })
            }
        },
        carregarAdicionais(item) {
            const itemCardapio = this.cardapio.find(cardapioItem => cardapioItem.id_itemcardapio === item.id_itemcardapio);

            if (itemCardapio) {
                this.adicionaisSelecionados = itemCardapio.adicionais || [];
                this.adicionaisModal = item.adicionais || [];
                this.itemAtual = item;

                if (!this.itemAtual.adicionais) {
                    this.itemAtual.adicionais = [];
                }
            } else {
                console.error('Item do cardápio não encontrado.');
            }
        },
        fecharPedido() {
            if (this.pedido.id_pedido == null) {
                this.preparaPedido().then(pedidoCriado => {
                    axios.post('/fecharPedido', { id_pedido: pedidoCriado.id_pedido }).then(resp => {
                        if (resp.data == true) {
                            this.resetarPedido();
                            this.id_pedido = null;
                            showToast('Pedido finalizado com sucesso!', 'success');
                        }
                    }).catch(error => {
                        showToast(error.response?.data?.erro || 'Erro ao finalizar pedido.', 'danger');
                        console.log(error);
                    });
                }).catch(error => {
                    // erro já tratado em preparaPedido
                });
            } else {
                const itensNovos = this.pedido.itens
                    .filter(item => item.id_itempedido == null)
                    .map(item => ({
                        adicionais: item.adicionais,
                        id_itemcardapio: item.id_itemcardapio,
                        observacao: item.observacao,
                        quantidade: item.quantidade
                    }));

                if (itensNovos.length > 0) {
                    axios.post('/adicionarItensPedido', {id_pedido: this.pedido.id_pedido, itens: itensNovos}).then(() => {
                        axios.post('/fecharPedido', { id_pedido: this.pedido.id_pedido }).then(resp => {
                            if (resp.data == true) {
                                this.resetarPedido();
                                this.id_pedido = null;
                                showToast('Pedido finalizado com sucesso!', 'success');
                                this.listarMesas();
                            }
                        }).catch(error => {
                            showToast(error.response?.data?.erro || 'Erro ao finalizar pedido.', 'danger');
                            console.log(error);
                        });
                    }).catch(error => {
                        showToast(error.response?.data?.erro || 'Erro ao adicionar itens ao pedido.', 'danger');
                        console.log(error);
                    });
                } else {
                    // Não há itens novos, só fecha o pedido
                    axios.post('/fecharPedido', { id_pedido: this.pedido.id_pedido }).then(resp => {
                        if (resp.data == true) {
                            this.resetarPedido();
                            this.id_pedido = null;
                            showToast('Pedido finalizado com sucesso!', 'success');
                            this.listarMesas();
                        }
                    }).catch(error => {
                        showToast(error.response?.data?.erro || 'Erro ao finalizar pedido.', 'danger');
                        console.log(error);
                    });
                }
            }
        },
        filtrarCardapio(categoria) {
            this.cardapioFiltrado = this.cardapio.filter(item => item.categoria === categoria);
        },
        getFuncionario() {
            axios.get('/identity').then(resp => {
                this.pedido.id_funcionario = resp.data.id_funcionario;
                this.id_funcionario = resp.data.id_funcionario;
            })
                .catch(error => {
                    console.log(error);
                });
        },
        iniciarEfetuarPedido() {
            this.listarCardapio();
            this.listarMesas();
            this.getFuncionario();

            let previousMesa = null;

            this.$watch('pedido.id_mesa', (newValue) => {
                if (newValue !== previousMesa) {
                    previousMesa = newValue;
                    this.buscarPedidoMesa(newValue);
                }
            });

            console.log(this.pedido);
        },
        listarCardapio() {
            axios.get('/listarCardapio').then(resp => {
                this.cardapio = resp.data;
                this.cardapioFiltrado = this.cardapio;
            })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao carregar cardápio.', 'danger');
                    console.log(error);
                });
        },
        listarMesas() {
            axios.get('/listarMesas').then(resp => {
                this.mesas = resp.data.filter(mesa => mesa.status === 'Disponível' || mesa.status === 'Aberta');
            })
                .catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao carregar mesas.', 'danger');
                    console.log(error);
                });
        },
        novoPedido(pedido) {
            if (pedido.id_pedido == null) {
                axios.post('/novoPedido', { pedido: pedido }).then(resp => {
                    showToast('Novo pedido criado com sucesso!', 'success');
                    this.listarMesas();
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao criar novo pedido.', 'danger');
                    console.log(error);
                });
            } else {
                axios.post('/adicionarItensPedido', pedido).then(resp => {
                    showToast('Itens adicionados ao pedido com sucesso!', 'success');
                    this.listarMesas();
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao adicionar itens ao pedido.', 'danger');
                    console.log(error);
                });
            }
            this.resetarPedido();
        },
        preparaPedido() {
            return new Promise((resolve, reject) => {
                let pedido;
                if (this.pedido.id_pedido == null) {
                    pedido = {
                        id_pedido: this.pedido.id_pedido,
                        id_mesa: this.pedido.id_mesa,
                        id_funcionario: this.pedido.id_funcionario,
                        observacao: this.pedido.observacao || '',
                        itens: []
                    };

                    this.pedido.itens.forEach((item) => {
                        var pedidoItem = {
                            id_itemcardapio: item.id_itemcardapio,
                            quantidade: parseInt(item.quantidade) || 1,
                            observacao: item.observacao || '',
                            adicionais: []
                        };

                        item.adicionais.forEach((adicional) => {
                            pedidoItem.adicionais.push({
                                id_adicional: adicional.id_adicional
                            });
                        });

                        pedido.itens.push(pedidoItem);
                    });
                } else {
                    pedido = {
                        id_pedido: this.pedido.id_pedido,
                        itens: []
                    };

                    this.pedido.itens.forEach((item, key) => {
                        if (item.id_itempedido == null) {
                            var pedidoItem = {
                                id_itemcardapio: item.id_itemcardapio,
                                quantidade: parseInt(item.quantidade) || 1,
                                observacao: item.observacao || '',
                                adicionais: []
                            };

                            item.adicionais.forEach((adicional) => {
                                pedidoItem.adicionais.push({
                                    id_adicional: adicional.id_adicional
                            });
                        });

                        pedido.itens.push(pedidoItem);
                        }
                    });
                }

                axios.post('/novoPedido', { pedido: pedido }).then(resp => {
                    showToast('Novo pedido criado com sucesso!', 'success');
                    resolve(resp.data);
                    this.resetarPedido();
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao criar novo pedido.', 'danger');
                    console.log(error);
                    reject(error);
                });
            });
        },
        removerAdicional(index) {
            this.adicionaisModal.splice(index, 1);
        },
        removerItem(index) {
            const idItemPedido = this.pedido.itens[index]?.id_itempedido;
            console.log(idItemPedido);
            if (idItemPedido == null) {
                this.pedido.itens.splice(index, 1);
                showToast('Item removido com sucesso!', 'success');
            } else {
                axios.post('/removerItemPedido', { id_itempedido: idItemPedido }).then(resp => {
                    this.pedido.itens.splice(index, 1);
                    showToast('Item removido com sucesso!', 'success');
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao remover item.', 'danger');
                    console.log(error);
                });
            }
        },
        resetarPedido() {
            this.pedido = {
                id_pedido: null,
                id_mesa: '',
                id_funcionario: this.id_funcionario,
                observacao: '',
                itens: []
            };

            this.adicionaisModal = [];
            this.adicionaisSelecionados = [];
            this.categoriaSelecionada = '';

            console.log('Pedido resetado para os valores iniciais:', this.pedido);
        },
        salvarAdicionais() {
            if (this.itemAtual) {
                this.itemAtual.adicionais = [...this.adicionaisModal];

                const itemCardapio = this.cardapio.find(cardapioItem => cardapioItem.id_itemcardapio === this.itemAtual.id_itemcardapio);

                if (itemCardapio) {
                    this.itemAtual.adicionais.forEach(adicional => {
                        const adicionalCardapio = itemCardapio.adicionais.find(a => a.id_adicional === parseInt(adicional.id_adicional));
                        if (adicionalCardapio) {
                            adicional.valor = parseFloat(adicionalCardapio.valor) || 0;
                        }
                    });

                    const valorAdicionais = this.itemAtual.adicionais.reduce((total, adicional) => total + (parseFloat(adicional.valor) || 0), 0);

                    const valorBase = parseFloat(itemCardapio.valor) || 0;


                    this.itemAtual.valor = (valorBase + valorAdicionais).toFixed(2);
                }
            }
            showToast('Adicionais salvos com sucesso!', 'success');
        },
        salvarObservacaoItem() {
            this.pedido.itens = this.pedido.itens.map(item =>
                item === this.itemObservacaoAtual ? { ...item, observacao: this.itemObservacaoAtual.observacao } : item
            );
            showToast('Observação salva!', 'success');
        },
        selecionarCategoria(categoria) {
            this.categoriaSelecionada = categoria;
            this.filtrarCardapio(categoria);
        },
    }
}

window.EfetuarPagamento = function () {
    return {
        meios_pagamento: [],
        tela: 'LIS',
        pag: { id_meiopagamento: '', valor_pagamento: 0 },
        pagamentos: [],
        pedidos: [],
        pedido_sel: {
            data_pedido: null,
            id_funcionario: null,
            id_mesa: '',
            id_pedido: null,
            id_statuspedido: null,
            observacao: '',
            itens: []
        },
        total_pago: 0,
        total_restante: 0,
        valor_total: 0,
        adicionarPagamento() {
            const valor = parseFloat(this.pag.valor_pagamento) || 0;
            const forma = parseInt(this.pag.id_meiopagamento);

            if (!forma || valor <= 0) {
                showToast('Informe a forma de pagamento e um valor válido.', 'danger');
                return;
            }

            this.pagamentos.push({
                id_meiopagamento: forma,
                valor_pagamento: valor.toFixed(2)
            });

            this.total_pago = this.pagamentos.reduce((soma, pag) => soma + parseFloat(pag.valor_pagamento), 0).toFixed(2);
            this.total_restante = (parseFloat(this.valor_total) - parseFloat(this.total_pago)).toFixed(2);

            this.pag = { id_meiopagamento: '', valor_pagamento: 0 };
        },
        buscarPedido(id_pedido) {
            axios.post('/buscarPedido', { id_pedido: id_pedido }).then(resp => {
                if (resp.data && Array.isArray(resp.data.itens)) {
                    resp.data.itens = resp.data.itens.map(item => {
                        let valorItem = parseFloat(item.valor) || 0;
                        let valorAdicionais = 0;
                        if (Array.isArray(item.adicionais)) {
                            valorAdicionais = item.adicionais.reduce((soma, adicional) => {
                                return soma + (parseFloat(adicional.valor) || 0);
                            }, 0);
                        }
                        
                        const valor_total_item = ((valorItem + valorAdicionais) * (parseInt(item.quantidade) || 1)).toFixed(2);
                        return { ...item, valor_total_item };
                    });
                }

                this.pedido_sel = resp.data;
                this.tela = 'PGT';

                let total = 0;
                if (this.pedido_sel && Array.isArray(this.pedido_sel.itens)) {
                    this.pedido_sel.itens.forEach(item => {
                        total += parseFloat(item.valor_total_item) || 0;
                    });
                }
                this.valor_total = total.toFixed(2);
                this.total_restante = total.toFixed(2);
                console.log(this.pedido_sel);
            }).catch(error => {
                showToast(error.response?.data?.erro || 'Erro ao buscar pedido.', 'danger');
                console.log(error);
            });
        },
        finalizarPagamento() {
            if (this.pagamentos.length > 0) {
                axios.post('/adicionarPagamentos', { id_pedido: this.pedido_sel.id_pedido, pagamentos: this.pagamentos }).then(resp => {
                    if (resp.data == true) {
                        showToast('Pagamento realizado com sucesso!', 'success');
                        this.listarPedidos();
                        this.tela = 'LIS';
                        this.pagamentos = [];
                    }
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao finalizar pagamento.', 'danger');
                    console.log(error);
                });
            } else {
                showToast('Nenhum pagamento adicionado.', 'danger');
            }
        },
        listarMeiosPagamento() {
            axios.get('/listarMeiosPagamento')
                .then(resp => {
                    this.meios_pagamento = resp.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        listarPedidos() {
            axios.get('/listarPedidosFechados').then(resp => {
                this.pedidos = resp.data;
            })
            .catch(error => {
                showToast(error.response?.data?.erro || 'Erro ao carregar pagamentos.', 'danger');
                console.log(error);
            });
        },
    }
}