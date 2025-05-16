window.EfetuarPedido = function () {
    return {
        adicionaisModal: [],
        adicionaisSelecionados: [],
        cardapio: [],
        cardapioFiltrado: [],
        categoriaSelecionada: '',
        id_funcionario: '',
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
            } else {
                axios.post('/cancelarPedido', { id_pedido: this.pedido.id_pedido }).then(resp => {
                    if (resp.data == true) {
                        this.resetarPedido();
                        showToast('Pedido cancelado com sucesso!', 'success');
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
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao criar novo pedido.', 'danger');
                    console.log(error);
                });
            } else {
                axios.post('/adicionarItensPedido', pedido).then(resp => {
                    showToast('Itens adicionados ao pedido com sucesso!', 'success');
                }).catch(error => {
                    showToast(error.response?.data?.erro || 'Erro ao adicionar itens ao pedido.', 'danger');
                    console.log(error);
                });
            }
            this.resetarPedido();
        },
        preparaPedido() {
            if (this.pedido.id_pedido == null) {
                console.log('NovoPEdido')
                var pedido = {
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
                console.log('AdicionarItem')
                var pedido = {
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

            this.novoPedido(pedido);
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