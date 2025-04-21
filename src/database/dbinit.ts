import { table } from "console";
import { Pool } from "pg";

async function initdb(pool: Pool) {

    try {
        // Verificar se já existe alguma tabela:
        const tableExists = await pool.query(`SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'cargo'
            )
        `)
        if (tableExists.rows[0].exists) {
            return; // Tabelas já foram criadas
        }

        // Caso contrário, inicializar tabelas:
        await pool.query(`
            BEGIN;

                CREATE OR REPLACE FUNCTION public.atualizar_data_alteracao()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.dataalteracao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.atualizar_data_alteracao()
    OWNER TO postgres;

CREATE TABLE public.cardapio (
    id_cardapio integer NOT NULL,
    nome character varying(100) NOT NULL,
    valor numeric(10,2) NOT NULL,
    categoria character varying(50) NOT NULL,
    ingredientes text,
    imagem bytea
);


ALTER TABLE public.cardapio OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32856)
-- Name: cardapio_id_cardapio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cardapio_id_cardapio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cardapio_id_cardapio_seq OWNER TO postgres;

--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 221
-- Name: cardapio_id_cardapio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cardapio_id_cardapio_seq OWNED BY public.cardapio.id_cardapio;


--
-- TOC entry 224 (class 1259 OID 32866)
-- Name: cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargo (
    id_cargo integer NOT NULL,
    nome character varying(50) NOT NULL
);


ALTER TABLE public.cargo OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32865)
-- Name: cargo_id_cargo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cargo_id_cargo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cargo_id_cargo_seq OWNER TO postgres;

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 223
-- Name: cargo_id_cargo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargo_id_cargo_seq OWNED BY public.cargo.id_cargo;


--
-- TOC entry 234 (class 1259 OID 32954)
-- Name: checkin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkin (
    id_checkin integer NOT NULL,
    checkin boolean NOT NULL,
    checkout boolean NOT NULL,
    id_mesa integer NOT NULL
);


ALTER TABLE public.checkin OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 32953)
-- Name: checkin_id_checkin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checkin_id_checkin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checkin_id_checkin_seq OWNER TO postgres;

--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 233
-- Name: checkin_id_checkin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checkin_id_checkin_seq OWNED BY public.checkin.id_checkin;


--
-- TOC entry 226 (class 1259 OID 32875)
-- Name: funcionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionario (
    id_funcionario integer NOT NULL,
    nome character varying(100) NOT NULL,
    cpf character varying(14) NOT NULL,
    id_cargo integer NOT NULL,
    telefone character varying(15) NOT NULL,
    imagem character varying(254),
    datacadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataalteracao timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.funcionario OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32874)
-- Name: funcionario_id_funcionario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.funcionario_id_funcionario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funcionario_id_funcionario_seq OWNER TO postgres;

--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 225
-- Name: funcionario_id_funcionario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.funcionario_id_funcionario_seq OWNED BY public.funcionario.id_funcionario;


--
-- TOC entry 228 (class 1259 OID 32889)
-- Name: login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login (
    id_login integer NOT NULL,
    cpf character varying(50) NOT NULL,
    senha character varying(255) NOT NULL,
    id_funcionario integer NOT NULL,
    salt character varying(255),
    session_token character varying(255),
    primeiro_login boolean DEFAULT true NOT NULL
);


ALTER TABLE public.login OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32888)
-- Name: login_id_login_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_id_login_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_id_login_seq OWNER TO postgres;

--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 227
-- Name: login_id_login_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_id_login_seq OWNED BY public.login.id_login;


--
-- TOC entry 220 (class 1259 OID 32843)
-- Name: mesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesa (
    id_mesa integer NOT NULL,
    numero_mesa integer NOT NULL,
    qtd_lugares integer NOT NULL,
    id_status integer NOT NULL
);


ALTER TABLE public.mesa OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32842)
-- Name: mesa_id_mesa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesa_id_mesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_id_mesa_seq OWNER TO postgres;

--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 219
-- Name: mesa_id_mesa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_id_mesa_seq OWNED BY public.mesa.id_mesa;


--
-- TOC entry 232 (class 1259 OID 32935)
-- Name: pagamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamento (
    id_pagamento integer NOT NULL,
    id_mesa integer NOT NULL,
    estado_pagamento character varying(50) NOT NULL,
    id_pedido integer NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    meio_pagamento character varying(50) NOT NULL,
    data_pagamento date DEFAULT CURRENT_DATE NOT NULL,
    hora_pagamento time without time zone DEFAULT CURRENT_TIME NOT NULL
);


ALTER TABLE public.pagamento OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 32934)
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagamento_id_pagamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNED BY public.pagamento.id_pagamento;


--
-- TOC entry 230 (class 1259 OID 32908)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    id_mesa integer NOT NULL,
    id_cardapio integer NOT NULL,
    quantidade integer NOT NULL,
    observacao text,
    id_garcom integer NOT NULL,
    estado_pedido character varying(50) NOT NULL,
    data_pedido date DEFAULT CURRENT_DATE NOT NULL,
    hora_pedido time without time zone DEFAULT CURRENT_TIME NOT NULL,
    CONSTRAINT pedido_quantidade_check CHECK ((quantidade > 0))
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32907)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 218 (class 1259 OID 32836)
-- Name: statusmesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statusmesa (
    id_status integer NOT NULL,
    status character varying(10) NOT NULL
);


ALTER TABLE public.statusmesa OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 32835)
-- Name: statusmesa_id_status_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statusmesa_id_status_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statusmesa_id_status_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 217
-- Name: statusmesa_id_status_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statusmesa_id_status_seq OWNED BY public.statusmesa.id_status;


--
-- TOC entry 4729 (class 2604 OID 32860)
-- Name: cardapio id_cardapio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cardapio ALTER COLUMN id_cardapio SET DEFAULT nextval('public.cardapio_id_cardapio_seq'::regclass);


--
-- TOC entry 4730 (class 2604 OID 32869)
-- Name: cargo id_cargo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo ALTER COLUMN id_cargo SET DEFAULT nextval('public.cargo_id_cargo_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 32957)
-- Name: checkin id_checkin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin ALTER COLUMN id_checkin SET DEFAULT nextval('public.checkin_id_checkin_seq'::regclass);


--
-- TOC entry 4731 (class 2604 OID 32878)
-- Name: funcionario id_funcionario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario ALTER COLUMN id_funcionario SET DEFAULT nextval('public.funcionario_id_funcionario_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 32892)
-- Name: login id_login; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login ALTER COLUMN id_login SET DEFAULT nextval('public.login_id_login_seq'::regclass);


--
-- TOC entry 4728 (class 2604 OID 32846)
-- Name: mesa id_mesa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa ALTER COLUMN id_mesa SET DEFAULT nextval('public.mesa_id_mesa_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 32938)
-- Name: pagamento id_pagamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento ALTER COLUMN id_pagamento SET DEFAULT nextval('public.pagamento_id_pagamento_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 32911)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 32839)
-- Name: statusmesa id_status; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statusmesa ALTER COLUMN id_status SET DEFAULT nextval('public.statusmesa_id_status_seq'::regclass);


--
-- TOC entry 4932 (class 0 OID 32857)
-- Dependencies: 222
-- Data for Name: cardapio; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4934 (class 0 OID 32866)
-- Dependencies: 224
-- Data for Name: cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cargo (id_cargo, nome) VALUES (1, 'Administrador') ON CONFLICT DO NOTHING;
INSERT INTO public.cargo (id_cargo, nome) VALUES (2, 'Atendente') ON CONFLICT DO NOTHING;
INSERT INTO public.cargo (id_cargo, nome) VALUES (3, 'Garçom') ON CONFLICT DO NOTHING;
INSERT INTO public.cargo (id_cargo, nome) VALUES (4, 'Gerente') ON CONFLICT DO NOTHING;


--
-- TOC entry 4944 (class 0 OID 32954)
-- Dependencies: 234
-- Data for Name: checkin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4936 (class 0 OID 32875)
-- Dependencies: 226
-- Data for Name: funcionario; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4938 (class 0 OID 32889)
-- Dependencies: 228
-- Data for Name: login; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4930 (class 0 OID 32843)
-- Dependencies: 220
-- Data for Name: mesa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4942 (class 0 OID 32935)
-- Dependencies: 232
-- Data for Name: pagamento; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4940 (class 0 OID 32908)
-- Dependencies: 230
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4928 (class 0 OID 32836)
-- Dependencies: 218
-- Data for Name: statusmesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.statusmesa (id_status, status) VALUES (1, 'Inativa') ON CONFLICT DO NOTHING;
INSERT INTO public.statusmesa (id_status, status) VALUES (2, 'Disponível') ON CONFLICT DO NOTHING;
INSERT INTO public.statusmesa (id_status, status) VALUES (3, 'Reservada') ON CONFLICT DO NOTHING;
INSERT INTO public.statusmesa (id_status, status) VALUES (4, 'Aberta') ON CONFLICT DO NOTHING;
INSERT INTO public.statusmesa (id_status, status) VALUES (5, 'Fechada') ON CONFLICT DO NOTHING;


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 221
-- Name: cardapio_id_cardapio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cardapio_id_cardapio_seq', 1, false);


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 223
-- Name: cargo_id_cargo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargo_id_cargo_seq', 4, true);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 233
-- Name: checkin_id_checkin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.checkin_id_checkin_seq', 1, false);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 225
-- Name: funcionario_id_funcionario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.funcionario_id_funcionario_seq', 13, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 227
-- Name: login_id_login_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_id_login_seq', 13, true);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 219
-- Name: mesa_id_mesa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mesa_id_mesa_seq', 1, false);


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagamento_id_pagamento_seq', 1, false);


--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedido_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 1, false);


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 217
-- Name: statusmesa_id_status_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statusmesa_id_status_seq', 5, true);


--
-- TOC entry 4751 (class 2606 OID 32864)
-- Name: cardapio cardapio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cardapio
    ADD CONSTRAINT cardapio_pkey PRIMARY KEY (id_cardapio);


--
-- TOC entry 4753 (class 2606 OID 32873)
-- Name: cargo cargo_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_nome_key UNIQUE (nome);


--
-- TOC entry 4755 (class 2606 OID 32871)
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (id_cargo);


--
-- TOC entry 4771 (class 2606 OID 32959)
-- Name: checkin checkin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin
    ADD CONSTRAINT checkin_pkey PRIMARY KEY (id_checkin);


--
-- TOC entry 4757 (class 2606 OID 32882)
-- Name: funcionario funcionario_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cpf_key UNIQUE (cpf);


--
-- TOC entry 4759 (class 2606 OID 32880)
-- Name: funcionario funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pkey PRIMARY KEY (id_funcionario);


--
-- TOC entry 4761 (class 2606 OID 32899)
-- Name: login login_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login
    ADD CONSTRAINT login_cpf_key UNIQUE (cpf);


--
-- TOC entry 4763 (class 2606 OID 32901)
-- Name: login login_id_funcionario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login
    ADD CONSTRAINT login_id_funcionario_key UNIQUE (id_funcionario);


--
-- TOC entry 4765 (class 2606 OID 32897)
-- Name: login login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login
    ADD CONSTRAINT login_pkey PRIMARY KEY (id_login);


--
-- TOC entry 4747 (class 2606 OID 32850)
-- Name: mesa mesa_numero_mesa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_numero_mesa_key UNIQUE (numero_mesa);


--
-- TOC entry 4749 (class 2606 OID 32848)
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (id_mesa);


--
-- TOC entry 4769 (class 2606 OID 32942)
-- Name: pagamento pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_pkey PRIMARY KEY (id_pagamento);


--
-- TOC entry 4767 (class 2606 OID 32918)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4745 (class 2606 OID 32841)
-- Name: statusmesa statusmesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statusmesa
    ADD CONSTRAINT statusmesa_pkey PRIMARY KEY (id_status);


--
-- TOC entry 4781 (class 2620 OID 32968)
-- Name: funcionario trigger_atualizar_data_alteracao; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_atualizar_data_alteracao BEFORE UPDATE ON public.funcionario FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_alteracao();


--
-- TOC entry 4780 (class 2606 OID 32960)
-- Name: checkin fk_checkin_mesa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin
    ADD CONSTRAINT fk_checkin_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);


--
-- TOC entry 4773 (class 2606 OID 32883)
-- Name: funcionario fk_funcionario_cargo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT fk_funcionario_cargo FOREIGN KEY (id_cargo) REFERENCES public.cargo(id_cargo);


--
-- TOC entry 4774 (class 2606 OID 32902)
-- Name: login fk_login_funcionario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login
    ADD CONSTRAINT fk_login_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionario(id_funcionario);


--
-- TOC entry 4772 (class 2606 OID 32851)
-- Name: mesa fk_mesa_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT fk_mesa_status FOREIGN KEY (id_status) REFERENCES public.statusmesa(id_status);


--
-- TOC entry 4778 (class 2606 OID 32943)
-- Name: pagamento fk_pagamento_mesa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT fk_pagamento_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);


--
-- TOC entry 4779 (class 2606 OID 32948)
-- Name: pagamento fk_pagamento_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT fk_pagamento_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 4775 (class 2606 OID 32924)
-- Name: pedido fk_pedido_cardapio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_cardapio FOREIGN KEY (id_cardapio) REFERENCES public.cardapio(id_cardapio);


--
-- TOC entry 4776 (class 2606 OID 32919)
-- Name: pedido fk_pedido_garcom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_garcom FOREIGN KEY (id_garcom) REFERENCES public.funcionario(id_funcionario);

--
-- TOC entry 4777 (class 2606 OID 32929)
-- Name: pedido fk_pedido_mesa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);

            COMMIT;
        `);

    } catch (error) {
        console.error("# Erro ao verificar/criar tabelas: ", error);
    }
}

export default initdb;
