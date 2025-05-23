window.RelCadapio = function () {
    return {
        categoria: '',
        data_inicio: '',
        data_fim: '',
        initRelCardapio() {
            const hoje = new Date();
            const padraoData = hoje.toISOString().slice(0, 10);
            this.data_inicio = padraoData;
            this.data_fim = padraoData;
        }
    }
}