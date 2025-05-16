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

                CREATE OR REPLACE FUNCTION atualiza_dataalteracao()
                RETURNS TRIGGER AS $$
                BEGIN
                IF NEW.redefinir_senha IS DISTINCT FROM OLD.redefinir_senha THEN
                NEW.dataalteracao := CURRENT_TIMESTAMP;
                END IF;
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;


            ALTER FUNCTION public.atualizar_data_alteracao()
            OWNER TO postgres;

            -- INÍCIO CREATE ADICIONAL

            CREATE TABLE public.adicional (
                id_adicional integer NOT NULL,
                id_itemcardapio integer NOT NULL,
                nome character varying(50) NOT NULL,
                valor numeric(10,2) NOT NULL,
                datacadastro timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                dataalteracao timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                ativo boolean NOT NULL DEFAULT true
            );

            ALTER TABLE public.adicional OWNER TO postgres;

            CREATE SEQUENCE public.adicional_id_adicional_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.adicional_id_adicional_seq OWNER TO postgres;

            ALTER SEQUENCE public.adicional_id_adicional_seq OWNED BY public.adicional.id_adicional;

            -- FIM CREATE ADICIONAL



            -- INÍCIO CREATE CARGO

            CREATE TABLE public.cargo (
                id_cargo integer NOT NULL,
                nome character varying(50) NOT NULL
            );

            ALTER TABLE public.cargo OWNER TO postgres;

            CREATE SEQUENCE public.cargo_id_cargo_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.cargo_id_cargo_seq OWNER TO postgres;

            ALTER SEQUENCE public.cargo_id_cargo_seq OWNED BY public.cargo.id_cargo;
            ALTER SEQUENCE public.cargo_id_cargo_seq OWNED BY public.cargo.id_cargo;

            -- FIM CREATE CARGO



            -- INÍCIO CREATE CATEGORIA

            CREATE TABLE public.categoria (
                id_categoria integer NOT NULL,
                nome character varying(50) NOT NULL
            );

            ALTER TABLE public.categoria OWNER TO postgres;

            CREATE SEQUENCE public.categoria_id_categoria_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.categoria_id_categoria_seq OWNER TO postgres;

            ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;

            -- FIM CREATE CATEGORIA



            -- INÍCIO CREATE CHECKIN

            CREATE TABLE public.checkin (
                id_checkin integer NOT NULL,
                checkin boolean NOT NULL,
                checkout boolean NOT NULL,
                id_mesa integer NOT NULL
            );

            ALTER TABLE public.checkin OWNER TO postgres;

            CREATE SEQUENCE public.checkin_id_checkin_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.checkin_id_checkin_seq OWNER TO postgres;

            ALTER SEQUENCE public.checkin_id_checkin_seq OWNED BY public.checkin.id_checkin;

            -- FIM CREATE CHECKIN



            -- INÍCIO CREATE FUNCIONARIO

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

            CREATE SEQUENCE public.funcionario_id_funcionario_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.funcionario_id_funcionario_seq OWNER TO postgres;

            ALTER SEQUENCE public.funcionario_id_funcionario_seq OWNED BY public.funcionario.id_funcionario;

            -- FIM CREATE FUNCIONARIO



            -- INÍCIO CREATE LOGIN

                CREATE TABLE public.login (
                id_login integer NOT NULL,
                cpf character varying(50) NOT NULL,
                senha character varying(255) NOT NULL,
                id_funcionario integer NOT NULL,
                salt character varying(255),
                session_token character varying(255),
                primeiro_login boolean DEFAULT true NOT NULL,
                redefinir_senha boolean DEFAULT false NOT NULL,
                dataalteracao timestamp without time zone
            );


            ALTER TABLE public.login OWNER TO postgres;

            CREATE SEQUENCE public.login_id_login_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            ALTER SEQUENCE public.login_id_login_seq OWNER TO postgres;

            ALTER SEQUENCE public.login_id_login_seq OWNED BY public.login.id_login;

            -- FIM CREATE LOGIN



            -- INÍCIO CREATE MESA

            CREATE TABLE public.mesa (
                id_mesa integer NOT NULL,
                numero_mesa integer NOT NULL,
                qtd_lugares integer NOT NULL,
                id_status integer NOT NULL,
                datacadastro timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                dataalteracao timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                ativo boolean NOT NULL DEFAULT true
            );

            ALTER TABLE public.mesa OWNER TO postgres;

            CREATE SEQUENCE public.mesa_id_mesa_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.mesa_id_mesa_seq OWNER TO postgres;

            ALTER SEQUENCE public.mesa_id_mesa_seq OWNED BY public.mesa.id_mesa;

            -- FIM CREATE MESA

            -- INICIO CREATE MEIO PAGAMENTO

                        CREATE TABLE public.meiopagamento (
                id_meiopagamento integer NOT NULL,
                nome character varying(20)
            );


            ALTER TABLE public.meiopagamento OWNER TO postgres;

            --
            -- TOC entry 245 (class 1259 OID 42432)
            -- Name: meio_pagamento_id_meiopagamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
            --

            CREATE SEQUENCE public.meio_pagamento_id_meiopagamento_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            ALTER SEQUENCE public.meio_pagamento_id_meiopagamento_seq OWNER TO postgres;

            ALTER SEQUENCE public.meio_pagamento_id_meiopagamento_seq OWNED BY public.meiopagamento.id_meiopagamento;

            -- FIM CREATE MEIO PAGAMENTO

            -- INÍCIO CREATE PAGAMENTO

           CREATE TABLE public.pagamento (
            id_pagamento integer NOT NULL,
            id_mesa integer NOT NULL,
            estado_pagamento character varying(50) NOT NULL,
            id_pedido integer NOT NULL,
            valor_total numeric(10,2) NOT NULL,
            data_pagamento date DEFAULT CURRENT_DATE NOT NULL,
            hora_pagamento time without time zone DEFAULT CURRENT_TIME NOT NULL,
            meio_pagamento integer NOT NULL
        );


        ALTER TABLE public.pagamento OWNER TO postgres;

        CREATE SEQUENCE public.pagamento_id_pagamento_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNER TO postgres;

        ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNED BY public.pagamento.id_pagamento;

            -- FIM CREATE PAGAMENTO



            -- INÍCIO CREATE PEDIDO

                    CREATE TABLE public.pedido (
                    id_pedido integer NOT NULL,
                    id_mesa integer NOT NULL,
                    observacao text,
                    id_funcionario integer NOT NULL,
                    id_statuspedido integer NOT NULL,
                    data_pedido timestamp without time zone DEFAULT CURRENT_DATE NOT NULL
                );


                ALTER TABLE public.pedido OWNER TO postgres;

                CREATE SEQUENCE public.pedido_id_pedido_seq
                    AS integer
                    START WITH 1
                    INCREMENT BY 1
                    NO MINVALUE
                    NO MAXVALUE
                    CACHE 1;

                ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO postgres;

                ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;

            -- FIM CREATE PEDIDO



            -- INÍCIO CREATE STATUSMESA

            CREATE TABLE public.statusmesa (
                id_status integer NOT NULL,
                status character varying(10) NOT NULL
            );

            ALTER TABLE public.statusmesa OWNER TO postgres;

            CREATE SEQUENCE public.statusmesa_id_status_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.statusmesa_id_status_seq OWNER TO postgres;

            ALTER SEQUENCE public.statusmesa_id_status_seq OWNED BY public.statusmesa.id_status;
            ALTER SEQUENCE public.statusmesa_id_status_seq OWNED BY public.statusmesa.id_status;

    -- FIM CREATE STATUSMESA

            -- INICIO CREATE ADICIONAL ITEM PEDIDO

            CREATE TABLE public.adicional_itempedido (
            id_adicional_itempedido integer NOT NULL,
            id_itempedido integer NOT NULL,
            id_adicional integer NOT NULL,
            valor numeric(10,2) NOT NULL
        );


        ALTER TABLE public.adicional_itempedido OWNER TO postgres;

        CREATE SEQUENCE public.adicional_itempedido_id_adicional_itempedido_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;

        ALTER SEQUENCE public.adicional_itempedido_id_adicional_itempedido_seq OWNER TO postgres;

        ALTER SEQUENCE public.adicional_itempedido_id_adicional_itempedido_seq OWNED BY public.adicional_itempedido.id_adicional_itempedido;

        -- FIM CREATE ADICIONAL ITEM PEDIDO

        -- INICIO CREATE ITEM CARDAPIO
                
            CREATE TABLE public.itemcardapio (
            id_itemcardapio integer NOT NULL,
            nome character varying(100) NOT NULL,
            valor numeric(10,2) NOT NULL,
            id_categoria integer NOT NULL,
            descricao text,
            datacadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
            dataalteracao timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
            ativo boolean DEFAULT true NOT NULL,
            imagem bytea
        );


        ALTER TABLE public.itemcardapio OWNER TO postgres;

        CREATE SEQUENCE public.itemcardapio_id_itemcardapio_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;


        ALTER SEQUENCE public.itemcardapio_id_itemcardapio_seq OWNER TO postgres;

        ALTER SEQUENCE public.itemcardapio_id_itemcardapio_seq OWNED BY public.itemcardapio.id_itemcardapio;

        -- FIM CREATE ITEM CARDAPIO

        -- INICIO CREATE ITEM PEDIDO

            CREATE TABLE public.itempedido (
            id_itempedido integer NOT NULL,
            id_pedido integer NOT NULL,
            id_itemcardapio integer NOT NULL,
            quantidade integer NOT NULL,
            valor numeric(10,2) NOT NULL,
            observacao text
        );


        ALTER TABLE public.itempedido OWNER TO postgres;

        CREATE SEQUENCE public.itempedido_id_itempedido_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;

        ALTER SEQUENCE public.itempedido_id_itempedido_seq OWNER TO postgres;

        ALTER SEQUENCE public.itempedido_id_itempedido_seq OWNED BY public.itempedido.id_itempedido;

        -- FIM CREATE ITEM PEDIDO

        -- INICIO CREATE STATUS PEDIDO

        CREATE TABLE public.statuspedido (
            id_statuspedido integer NOT NULL,
            nome character varying(24) NOT NULL
        );


        ALTER TABLE public.statuspedido OWNER TO postgres;

        CREATE SEQUENCE public.statuspedido_id_statuspedido_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;

        ALTER SEQUENCE public.statuspedido_id_statuspedido_seq OWNER TO postgres;

        ALTER SEQUENCE public.statuspedido_id_statuspedido_seq OWNED BY public.statuspedido.id_statuspedido;

        -- FIM CREATE STATUS PEDIDO



            ALTER TABLE ONLY public.itemcardapio ALTER COLUMN id_itemcardapio SET DEFAULT nextval('public.itemcardapio_id_itemcardapio_seq'::regclass);

            ALTER TABLE ONLY public.adicional ALTER COLUMN id_adicional SET DEFAULT nextval('public.adicional_id_adicional_seq'::regclass);

            ALTER TABLE ONLY public.cargo ALTER COLUMN id_cargo SET DEFAULT nextval('public.cargo_id_cargo_seq'::regclass);

            ALTER TABLE ONLY public.checkin ALTER COLUMN id_checkin SET DEFAULT nextval('public.checkin_id_checkin_seq'::regclass);

            ALTER TABLE ONLY public.funcionario ALTER COLUMN id_funcionario SET DEFAULT nextval('public.funcionario_id_funcionario_seq'::regclass);

            ALTER TABLE ONLY public.login ALTER COLUMN id_login SET DEFAULT nextval('public.login_id_login_seq'::regclass);

            ALTER TABLE ONLY public.mesa ALTER COLUMN id_mesa SET DEFAULT nextval('public.mesa_id_mesa_seq'::regclass);

            ALTER TABLE ONLY public.meiopagamento ALTER COLUMN id_meiopagamento SET DEFAULT nextval('public.meio_pagamento_id_meiopagamento_seq'::regclass);

            ALTER TABLE ONLY public.pagamento ALTER COLUMN id_pagamento SET DEFAULT nextval('public.pagamento_id_pagamento_seq'::regclass);

            ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);

            ALTER TABLE ONLY public.statusmesa ALTER COLUMN id_status SET DEFAULT nextval('public.statusmesa_id_status_seq'::regclass);

            ALTER TABLE ONLY public.itempedido ALTER COLUMN id_itempedido SET DEFAULT nextval('public.itempedido_id_itempedido_seq'::regclass);

            ALTER TABLE ONLY public.adicional_itempedido ALTER COLUMN id_adicional_itempedido SET DEFAULT nextval('public.adicional_itempedido_id_adicional_itempedido_seq'::regclass);


            -- INÍCIO INSERT INTO CARGO

            INSERT INTO public.cargo (id_cargo, nome) VALUES (1, 'Administrador') ON CONFLICT DO NOTHING;
            INSERT INTO public.cargo (id_cargo, nome) VALUES (2, 'Atendente') ON CONFLICT DO NOTHING;
            INSERT INTO public.cargo (id_cargo, nome) VALUES (3, 'Garçom') ON CONFLICT DO NOTHING;
            INSERT INTO public.cargo (id_cargo, nome) VALUES (4, 'Gerente') ON CONFLICT DO NOTHING;

            -- FIM INSERT INTO CARGO



            -- INÍCIO INSERT INTO CATEGORIA

            INSERT INTO public.categoria (id_categoria, nome) VALUES (1, 'Sucos') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (2, 'Sopas') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (3, 'Saladas') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (4, 'Refrigerantes') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (5, 'Massas') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (6, 'Carnes') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (7, 'Bebidas Quentes') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (8, 'Bebidas Alcoólicas') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (9, 'Aves') ON CONFLICT DO NOTHING;
            INSERT INTO public.categoria (id_categoria, nome) VALUES (10, 'Aperitivos') ON CONFLICT DO NOTHING;

            -- FIM INSERT INTO CATEGORIA



            -- INÍCIO INSERT INTO STATUSMESA

            INSERT INTO public.statusmesa (id_status, status) VALUES (1, 'Inativa') ON CONFLICT DO NOTHING;
            INSERT INTO public.statusmesa (id_status, status) VALUES (2, 'Disponível') ON CONFLICT DO NOTHING;
            INSERT INTO public.statusmesa (id_status, status) VALUES (3, 'Reservada') ON CONFLICT DO NOTHING;
            INSERT INTO public.statusmesa (id_status, status) VALUES (4, 'Aberta') ON CONFLICT DO NOTHING;
            INSERT INTO public.statusmesa (id_status, status) VALUES (5, 'Fechada') ON CONFLICT DO NOTHING;

            -- FIM INSERT INTO STATUSMESA

            -- INICIO INSERT INTO MEIO PAGAMENTO

            INSERT INTO public.meiopagamento (id_meiopagamento, nome) VALUES (1, 'Dinheiro');
            INSERT INTO public.meiopagamento (id_meiopagamento, nome) VALUES (2, 'PIX');
            INSERT INTO public.meiopagamento (id_meiopagamento, nome) VALUES (3, 'Débito');
            INSERT INTO public.meiopagamento (id_meiopagamento, nome) VALUES (4, 'Crédito');

            -- FIM INSERT INTO MEIO PAGAMENTO



            -- INICIO INSERT INTO STATUS PEDIDO

            INSERT INTO public.statuspedido (id_statuspedido, nome) VALUES (1, 'Aberto') ON CONFLICT DO NOTHING;
            INSERT INTO public.statuspedido (id_statuspedido, nome) VALUES (2, 'Fechado') ON CONFLICT DO NOTHING;
            INSERT INTO public.statuspedido (id_statuspedido, nome) VALUES (3, 'Concluído') ON CONFLICT DO NOTHING;
            INSERT INTO public.statuspedido (id_statuspedido, nome) VALUES (4, 'Cancelado') ON CONFLICT DO NOTHING;

            -- FIM INSERT INTO STATUS PEDIDO

            SELECT pg_catalog.setval('public.adicional_id_adicional_seq', 1, false);

            SELECT pg_catalog.setval('public.adicional_itempedido_id_adicional_itempedido_seq', 1, false);

            SELECT pg_catalog.setval('public.cargo_id_cargo_seq', 1, true);

            SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 1, false);
            

            SELECT pg_catalog.setval('public.checkin_id_checkin_seq', 1, false);

            SELECT pg_catalog.setval('public.funcionario_id_funcionario_seq', 1, true);

            SELECT pg_catalog.setval('public.itemcardapio_id_itemcardapio_seq', 1, true);

            SELECT pg_catalog.setval('public.itempedido_id_itempedido_seq', 1, false);

            SELECT pg_catalog.setval('public.login_id_login_seq', 1, true);

            SELECT pg_catalog.setval('public.mesa_id_mesa_seq', 1, false);

            SELECT pg_catalog.setval('public.meio_pagamento_id_meiopagamento_seq', 1, true);

            SELECT pg_catalog.setval('public.pagamento_id_pagamento_seq', 1, false);

            SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 1, false);

            SELECT pg_catalog.setval('public.statusmesa_id_status_seq', 1, true);

            SELECT pg_catalog.setval('public.statuspedido_id_statuspedido_seq', 1, false);

            ALTER TABLE ONLY public.adicional
                ADD CONSTRAINT adicional_pkey PRIMARY KEY (id_adicional);

            ALTER TABLE ONLY public.itemcardapio
                ADD CONSTRAINT cardapio_pkey PRIMARY KEY (id_itemcardapio);

            ALTER TABLE ONLY public.cargo
                ADD CONSTRAINT cargo_nome_key UNIQUE (nome);

            ALTER TABLE ONLY public.cargo
                ADD CONSTRAINT cargo_pkey PRIMARY KEY (id_cargo);

            ALTER TABLE ONLY public.checkin
                ADD CONSTRAINT checkin_pkey PRIMARY KEY (id_checkin);

            ALTER TABLE ONLY public.funcionario
                ADD CONSTRAINT funcionario_cpf_key UNIQUE (cpf);

            ALTER TABLE ONLY public.funcionario
                ADD CONSTRAINT funcionario_pkey PRIMARY KEY (id_funcionario);

            ALTER TABLE ONLY public.login
                ADD CONSTRAINT login_cpf_key UNIQUE (cpf);

            ALTER TABLE ONLY public.login
                ADD CONSTRAINT login_id_funcionario_key UNIQUE (id_funcionario);

            ALTER TABLE ONLY public.login
                ADD CONSTRAINT login_pkey PRIMARY KEY (id_login);

            ALTER TABLE ONLY public.mesa
                ADD CONSTRAINT mesa_numero_mesa_key UNIQUE (numero_mesa);

            ALTER TABLE ONLY public.mesa
                ADD CONSTRAINT mesa_pkey PRIMARY KEY (id_mesa);

            ALTER TABLE ONLY public.meiopagamento
                 ADD CONSTRAINT id_meiopagamento PRIMARY KEY (id_meiopagamento);

            ALTER TABLE ONLY public.pagamento
                ADD CONSTRAINT pagamento_pkey PRIMARY KEY (id_pagamento);

            ALTER TABLE ONLY public.pedido
                ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);

            ALTER TABLE ONLY public.adicional_itempedido
                ADD CONSTRAINT pk_adicional_itempedido PRIMARY KEY (id_adicional_itempedido);

            ALTER TABLE ONLY public.itempedido
                ADD CONSTRAINT pk_itempedido PRIMARY KEY (id_itempedido);

            ALTER TABLE ONLY public.statusmesa
                ADD CONSTRAINT statusmesa_pkey PRIMARY KEY (id_status);

            ALTER TABLE ONLY public.statuspedido
                ADD CONSTRAINT statuspedido_pkey PRIMARY KEY (id_statuspedido);

            CREATE TRIGGER trg_adicional_dataalteracao BEFORE UPDATE ON public.adicional FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_alteracao();

            CREATE TRIGGER trg_itemcardapio_dataalteracao BEFORE UPDATE ON public.itemcardapio FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_alteracao();

            CREATE TRIGGER trg_mesa_dataalteracao BEFORE UPDATE ON public.mesa FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_alteracao();

            CREATE TRIGGER trigger_atualizar_data_alteracao BEFORE UPDATE ON public.funcionario FOR EACH ROW EXECUTE FUNCTION public.atualizar_data_alteracao();

            CREATE TRIGGER trigger_dataalteracao BEFORE UPDATE ON public.login FOR EACH ROW EXECUTE FUNCTION public.atualiza_dataalteracao();

            ALTER TABLE ONLY public.adicional_itempedido
                ADD CONSTRAINT fk_adicional FOREIGN KEY (id_adicional) REFERENCES public.adicional(id_adicional);

            ALTER TABLE ONLY public.checkin
                ADD CONSTRAINT fk_checkin_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);

            ALTER TABLE ONLY public.funcionario
                ADD CONSTRAINT fk_funcionario_cargo FOREIGN KEY (id_cargo) REFERENCES public.cargo(id_cargo);

            ALTER TABLE ONLY public.pedido
                ADD CONSTRAINT fk_id_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionario(id_funcionario);

            ALTER TABLE ONLY public.itempedido
                ADD CONSTRAINT fk_id_itemcardapio FOREIGN KEY (id_itemcardapio) REFERENCES public.itemcardapio(id_itemcardapio);

            ALTER TABLE ONLY public.pedido
                ADD CONSTRAINT fk_id_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);

            ALTER TABLE ONLY public.itempedido
                ADD CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);

            ALTER TABLE ONLY public.adicional
                ADD CONSTRAINT fk_itemcardapio FOREIGN KEY (id_itemcardapio) REFERENCES public.itemcardapio(id_itemcardapio) NOT VALID;

            ALTER TABLE ONLY public.adicional_itempedido
                ADD CONSTRAINT fk_itempedido FOREIGN KEY (id_itempedido) REFERENCES public.itempedido(id_itempedido);

            ALTER TABLE ONLY public.pagamento
                ADD CONSTRAINT fk_meio_pagamento FOREIGN KEY (meio_pagamento) REFERENCES public.meiopagamento(id_meiopagamento) NOT VALID;

            ALTER TABLE ONLY public.login
                ADD CONSTRAINT fk_login_funcionario FOREIGN KEY (id_funcionario) REFERENCES public.funcionario(id_funcionario);

            ALTER TABLE ONLY public.mesa
                ADD CONSTRAINT fk_mesa_status FOREIGN KEY (id_status) REFERENCES public.statusmesa(id_status);

            ALTER TABLE ONLY public.pagamento
                ADD CONSTRAINT fk_pagamento_mesa FOREIGN KEY (id_mesa) REFERENCES public.mesa(id_mesa);

            ALTER TABLE ONLY public.pagamento
                ADD CONSTRAINT fk_pagamento_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);

            COMMIT;

            -- teste para novo commit

        `);

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("# Erro ao verificar/criar tabelas: ", error);
    }
}

export default initdb;
