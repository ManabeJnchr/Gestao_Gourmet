window.RelCardapio = function () {
    return {
        categoria: '',
        categorias: [],
        data_inicial: '',
        data_final: '',
        exibir_inativo: false,
        rel_cardapio: [],
        gerarRelatorio() {
            const filtros = { categoria: this.categoria, data_inicial: this.data_inicial, data_final: this.data_final, exibir_inativo: this.exibir_inativo };
            axios.post('/gerarRelatorioCardapio', filtros).then(resp => {
                this.rel_cardapio = resp.data;
                this.ordenarPor('nome_item');
            }).catch(error => {
                console.log(error);
            });
        },
        inicializarData() {
            const hoje = new Date();
            const padraoData = hoje.toISOString().slice(0, 10);
            this.data_inicial = padraoData;
            this.data_final = padraoData;
        },
        listarCategorias() {
            axios.get('/listarCategorias').then(resp => {
                this.categorias = resp.data;
            }).catch(error => {
                console.log(error);
            });
        },
        ordenarPor(prop) {
            const propsNumericas = [
                'valor_atual',
                'vezes_pedido',
                'valor_sem_adicionais',
                'valor_adicionais',
                'valor_total_com_adicionais'
            ];
            this.rel_cardapio.sort((a, b) => {
                if (a[prop] === undefined || b[prop] === undefined) return 0;

                if (propsNumericas.includes(prop)) {
                    const numA = Number(a[prop]);
                    const numB = Number(b[prop]);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numB - numA; // decrescente
                    }
                    return 0;
                }

                // Para strings, ordena ignorando maiúsculas/minúsculas (crescente)
                if (typeof a[prop] === 'string' && typeof b[prop] === 'string') {
                    return a[prop].localeCompare(b[prop], 'pt-BR', { sensitivity: 'base' });
                }

                return 0;
            });
        },
        resetarFiltros() {
            this.categoria = '';
            this.data_inicial = '';
            this.data_final = '';
            this.exibir_inativo = false;
        },
    }
}

window.RelFuncionario = function () {
    return {
        cargo: '',
        cargos: [],
        data_inicial: '',
        data_final: '',
        rel_funcionario: [],
        gerarRelatorio() {
            const filtros = { cargo: this.cargo, data_inicial: this.data_inicial, data_final: this.data_final };
            axios.post('/gerarRelatorioFuncionario', filtros).then(resp => {
                this.rel_funcionario = resp.data;
                this.ordenarPor('nome');
            }).catch(error => {
                console.log(error);
            });
        },
        inicializarData() {
            const hoje = new Date();
            const padraoData = hoje.toISOString().slice(0, 10);
            this.data_inicial = padraoData;
            this.data_final = padraoData;
        },
        ordenarPor(prop) {
            const propsNumericas = [
                'qtde_atendimentos',
                'valor_total_vendido',
            ];
            this.rel_funcionario.sort((a, b) => {
                if (a[prop] === undefined || b[prop] === undefined) return 0;

                if (propsNumericas.includes(prop)) {
                    const numA = Number(a[prop]);
                    const numB = Number(b[prop]);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numB - numA; // decrescente
                    }
                    return 0;
                }

                // Para strings, ordena ignorando maiúsculas/minúsculas (crescente)
                if (typeof a[prop] === 'string' && typeof b[prop] === 'string') {
                    return a[prop].localeCompare(b[prop], 'pt-BR', { sensitivity: 'base' });
                }

                return 0;
            });
        },
        resetarFiltros() {
            this.cargo = '';
            this.data_inicial = '';
            this.data_final = '';
        }
    }
}

window.RelPedido = function () {
    return {
        mesa: '',
        mesas: [],
        data_inicial: '',
        data_final: '',
        rel_pagamento: [],
        rel_pedido: [],
        graf_pedido: [],
        chart_pagamentos: null,
        gerarRelatorio() {
            const filtros = { mesa: this.mesa, data_inicial: this.data_inicial, data_final: this.data_final };
            this.gerarRelatorioPagamento(filtros);
            this.gerarRelatorioPedido(filtros);
            this.renderizaGrafico();
        },
        gerarRelatorioPagamento(filtros) {
            axios.post('/gerarRelatorioPagamento', filtros).then(resp => {
                this.rel_pagamento = resp.data;
            }).catch(error => {
                console.log(error);
            })
        },
        gerarRelatorioPedido(filtros) {
            axios.post('/gerarRelatorioPedido', filtros).then(resp => {
                this.rel_pedido = resp.data;
            }).catch(error => {
                console.log(error);
            })
        },
        inicializarData() {
            const hoje = new Date();
            const padraoData = hoje.toISOString().slice(0, 10);
            this.data_inicial = padraoData;
            this.data_final = padraoData;
        },
        listarMesas() {
            axios.get('/listarMesas').then(resp => {
                this.mesas = resp.data;
            }).catch(error => {
                console.log(error);
            });
        },
        renderizaGrafico() {
            // Destroi o gráfico anterior, se existir
            if (this.chart_pagamentos) {
                this.chart_pagamentos.destroy();
            }

            var series = this.rel_pagamento.map(item => Number(item.valor_pagamentos) || 0);
            var labels = this.rel_pagamento.map(item => item.meio_pagamento);

            var options = {
                series: series,
                chart: {
                    height: '100%',
                    width: '100%',
                    type: 'pie',
                },
                labels: labels,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: '100%',
                            width: '100%'
                        },
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            text: 'Valor por meio de pagamento (R$)',
                        },
                    }
                }]
            };

            this.chart_pagamentos = new ApexCharts(document.querySelector("#pie_chart_pagamentos"), options);
            this.chart_pagamentos.render();
        },
        resetarFiltros() {
            this.categoria = '';
            this.data_inicial = '';
            this.data_final = '';
            this.exibir_inativo = false;
        }
    }
}