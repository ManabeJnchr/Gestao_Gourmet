window.RelCardapio = function () {
    return {
        categoria: '',
        categorias: [],
        data_inicial: '',
        data_final: '',
        rel_cardapio: [],
        gerarRelatorio() {
            const filtros = { categoria: this.categoria, data_inicial: this.data_inicial, data_final: this.data_final };
            axios.post('/gerarRelatorioCardapio', filtros).then(resp => {
                this.rel_cardapio = resp.data;
            }).catch(error => {
                console.log(error);
            });
        },
        initRelCardapio() {
            this.listarCategorias();
            this.inicializarData();
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
        resetarFiltros() {
            this.categoria = '';
            this.data_inicial = '';
            this.data_final = '';
            this.inicializarData();
        }
    }
}