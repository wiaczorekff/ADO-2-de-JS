"use strict";

prepararTestes(funcs => {
    const erroGravissimo = funcs.erroGravissimo;
    window.onerror = (ev, arquivo, linha, coluna, erro) => {
        erroGravissimo(""
                + "<h1>SE VOCÊ ESTÁ VENDO ISSO, É PORQUE O SEU JAVASCRIPT CONTÉM ERROS GRAVES.</h1>"
                + "<p>Este é um erro gravíssimo. Veja mais detalhes no console do navegador para tentar entender onde ocorreu o erro.</p>"
                + "<p>Quem entregar para o professor algo que faça esta mensagem aparecer, vai ficar com nota zero!</p>"
        );
        document.querySelector("#testefw-botao-executar").disabled = true;
    };
    const divNota = document.querySelector("#testefw-nota");
    if (divNota) divNota.style.display = "none";
},
funcs => {
    const grupo = funcs.grupo;
    const teste = funcs.teste;
    const igual = funcs.igual;
    const naoDeuErro = funcs.naoDeuErro;
    const Utilitarios = funcs.Utilitarios;
    const Xoshiro128ssSeedRandom = funcs.Xoshiro128ssSeedRandom;
    const erroGravissimo = funcs.erroGravissimo;
    const numeroMaximoDeAlunos = 5;
    const random = Xoshiro128ssSeedRandom.std();
    let nomesOk = false;
    function testOk() { return nomesOk; }
    function setTestOk(ok) { nomesOk = ok; }

    function mexer(oQue, coisaRuim, verificador) {
        const c = coisaRuim("objeto").trim().replaceAll(/ +/g, ' ');
        const v = verificador("objeto").trim().replaceAll(/ +/g, ' ');
        return ``
                + `() => (() => {\n`
                + `    let fezCoisaRuim = false;\n`
                + `    const objeto = ${oQue};\n`
                + `    try {\n`
                + `        ${c};\n`
                + `        fezCoisaRuim = true;\n`
                + `    } catch (e) { \n`
                + `        // A exceção é esperada. Tem que dar errado se não houver exceção!\n`
                + `    }\n`
                + `    if (fezCoisaRuim) throw new Error("Deixou setar!");\n`
                + `    if (${v}) throw new Error("Não era pra o objeto ter sofrido alteração!");\n`
                + `})()`;
    }

    class Abacaxi {}

    // NOME DOS ALUNOS.

    function validarNomesAlunos() {
        const alunos = nomesDosAlunos(), nomes = [];
        if (!(alunos instanceof Array)) throw new Error("Os nomes do(a)(s) aluno(a)(s) deveriam estar em um array.");
        if (alunos.length === 0) throw new Error("Você(s) se esqueceu(ram) de preencher os nomes do(a)(s) aluno(a)(s).");

        alunos.forEach((aluno, idx) => {
            const numero = idx + 1;

            if (typeof aluno !== "string") throw new Error(`O nome do(a) aluno(a) ${numero} deveria ser uma string.`);
            if (["João da Silva", "Maria da Silva", ""].includes(aluno.trim())) {
                throw new Error(`O nome do(a) aluno(a) ${numero} não está correto.`);
            }
            if (aluno !== aluno.trim()) {
                throw new Error(`Não deixe espaços em branco sobrando no começo ou no final do nome de ${aluno.trim()}.`);
            }
            if (nomes.includes(aluno)) throw new Error("Há nomes de alunos(as) repetidos.");
            nomes.push(aluno);
        });
        if (alunos.length > numeroMaximoDeAlunos) {
            throw new Error(`Vocês só podem fazer grupo de até ${numeroMaximoDeAlunos} alunos(as).`);
        }
        return alunos;
    }

    function mostrarValidacaoNomesAlunos() {
        try {
            const alunos = validarNomesAlunos();
            alunos.forEach(nome => {
                const li = document.createElement("li");
                li.append(nome);
                document.querySelector("#testefw-alunos").append(li);
            });
        } catch (e) {
            erroGravissimo(""
                    + "<h1>SE VOCÊ ESTÁ VENDO ISSO, É PORQUE VOCÊ NÃO DEFINIU CORRETAMENTE OS INTEGRANTES DO SEU GRUPO.</h1>"
                    + "<p>Arrumar isto é a primeira coisa que você tem que fazer neste ADO, e assim que o fizer esta mensagem vai desaparecer.</p>"
                    + "<p>Procure a função nomesDosAlunos() no arquivo ado1.js.</p>"
                    + "<p>Quem entregar para o professor um JavaScript que faça esta mensagem aparecer, vai ficar com nota zero!</p>"
            );
            throw e;
        }
    }

    grupo("Nomes dos alunos", "Verifica se a identificação do(a)(s) aluno(a)(s) está ok").naoFracionado.minimo(-10).testes([
        teste("Listagem de alunos ok.", () => mostrarValidacaoNomesAlunos(), naoDeuErro(), undefined, setTestOk)
    ]);

    // Exercício 1.

    grupo("Exercício 1 - parte 1 (caminho feliz)", "Construtor de Nota").maximo(0.4).testes([
        teste("Nota 10 e peso 10 está ok."  , () => new Nota(10  , 10  ), naoDeuErro(), testOk),
        teste("Nota 8 e peso 4 está ok."    , () => new Nota( 8  ,  4  ), naoDeuErro(), testOk),
        teste("Nota 2 e peso 3 está ok."    , () => new Nota( 2  ,  3  ), naoDeuErro(), testOk),
        teste("Nota 7.8 e peso 2.5 está ok.", () => new Nota( 7.8,  2.5), naoDeuErro(), testOk),
        teste("Nota 0 e peso 10 está ok."   , () => new Nota(10  ,  0  ), naoDeuErro(), testOk),
        teste("Nota 10 e peso 0 está ok."   , () => new Nota( 0  , 10  ), naoDeuErro(), testOk),
        teste("Nota 5 e peso 5 está ok."    , () => new Nota( 5  ,  5  ), naoDeuErro(), testOk),
    ]);

    function testarConstrutorNota(erro, nota, peso) {
        const msg = erro === TypeError ? "A nota e o peso devem ser numéricos." : "A nota e o peso devem ser um número entre 0 e 10.";
        return ``
                + `() => (() => {\n`
                + `    try {\n`
                + `        new Nota(${nota}, ${peso});\n`
                + `    } catch (e) {\n`
                + `        if (!(e instanceof ${erro.name}) || e?.message !== "${msg}") throw e; // Não era a exceção que devia ter sido.\n`
                + `        return;\n`
                + `    }\n`
                + `    throw new Error("O construtor de Nota aceitou porcaria.");\n`
                + `})()`;
    }

    grupo("Exercício 1 - parte 2 (caminho infeliz com TypeError)", "Construtor de Nota com parâmetros de tipo inválido").maximo(0.3).testes([
        teste("Nota null não está ok."     , eval(testarConstrutorNota(TypeError,            null,            10  )), naoDeuErro(), testOk),
        teste("Peso null não está ok."     , eval(testarConstrutorNota(TypeError,              10,            null)), naoDeuErro(), testOk),
        teste("Nota undefined não está ok.", eval(testarConstrutorNota(TypeError,       undefined,              10)), naoDeuErro(), testOk),
        teste("Peso undefined não está ok.", eval(testarConstrutorNota(TypeError,              10,       undefined)), naoDeuErro(), testOk),
        teste("Nota NaN não está ok."      , eval(testarConstrutorNota(TypeError,             NaN,              10)), naoDeuErro(), testOk),
        teste("Peso NaN não está ok."      , eval(testarConstrutorNota(TypeError,              10,             NaN)), naoDeuErro(), testOk),
        teste("Nota string não está ok."   , eval(testarConstrutorNota(TypeError,     '"bug bug"',              10)), naoDeuErro(), testOk),
        teste("Peso string não está ok."   , eval(testarConstrutorNota(TypeError,              10,     '"bug bug"')), naoDeuErro(), testOk),
        teste("Nota objeto não está ok."   , eval(testarConstrutorNota(TypeError,    '{bug: "x"}',              10)), naoDeuErro(), testOk),
        teste("Peso objeto não está ok."   , eval(testarConstrutorNota(TypeError,              10,    '{bug: "x"}')), naoDeuErro(), testOk),
        teste("Nota abacaxi não está ok."  , eval(testarConstrutorNota(TypeError, 'new Abacaxi()',              10)), naoDeuErro(), testOk),
        teste("Peso abacaxi não está ok."  , eval(testarConstrutorNota(TypeError,              10, 'new Abacaxi()')), naoDeuErro(), testOk),
        teste("Nota infinita não está ok." , eval(testarConstrutorNota(TypeError,        Infinity,              10)), naoDeuErro(), testOk),
        teste("Peso infinita não está ok." , eval(testarConstrutorNota(TypeError,              10,        Infinity)), naoDeuErro(), testOk),
        teste("Nota -infinita não está ok.", eval(testarConstrutorNota(TypeError,       -Infinity,              10)), naoDeuErro(), testOk),
        teste("Peso -infinita não está ok.", eval(testarConstrutorNota(TypeError,              10,       -Infinity)), naoDeuErro(), testOk)
    ]);

    grupo("Exercício 1 - parte 3 (caminho infeliz com RangeError)", "Construtor de Nota com parâmetros de valores inválidos").maximo(0.3).testes([
        teste("Nota -5 não está ok."     , eval(testarConstrutorNota(RangeError,   -5  ,   10  )), naoDeuErro(), testOk),
        teste("Peso -5 não está ok."     , eval(testarConstrutorNota(RangeError,   10  ,   -5  )), naoDeuErro(), testOk),
        teste("Nota -0.1 não está ok."   , eval(testarConstrutorNota(RangeError,   -0.1,   10  )), naoDeuErro(), testOk),
        teste("Peso -0.1 não está ok."   , eval(testarConstrutorNota(RangeError,   10  ,   -0.1)), naoDeuErro(), testOk),
        teste("Nota 10.1 não está ok."   , eval(testarConstrutorNota(RangeError,   10.1,   10  )), naoDeuErro(), testOk),
        teste("Peso 10.1 não está ok."   , eval(testarConstrutorNota(RangeError,   10  ,   10.1)), naoDeuErro(), testOk),
        teste("Nota 9999 não está ok."   , eval(testarConstrutorNota(RangeError, 9999  ,   10  )), naoDeuErro(), testOk),
        teste("Peso 9999 não está ok."   , eval(testarConstrutorNota(RangeError,   10  , 9999  )), naoDeuErro(), testOk)
    ]);

    // Exercício 2.

    function testarGettersNota(valor, peso) {
        return ``
                + `() => (() => {\n`
                + `    const n = new Nota(${valor}, ${peso});\n`
                + `    return [n.valor, n.peso];\n`
                + `})()`;
    }

    grupo("Exercício 2", "Getters de Nota").maximo(0.3).testes([
        teste("Nota 10 e peso 10 está ok."  , eval(testarGettersNota(10  , 10  )), igual([10  , 10  ]), testOk),
        teste("Nota 8 e peso 4 está ok."    , eval(testarGettersNota( 8  ,  4  )), igual([ 8  ,  4  ]), testOk),
        teste("Nota 2 e peso 3 está ok."    , eval(testarGettersNota( 2  ,  3  )), igual([ 2  ,  3  ]), testOk),
        teste("Nota 7.8 e peso 2.5 está ok.", eval(testarGettersNota( 7.8,  2.5)), igual([ 7.8,  2.5]), testOk),
        teste("Nota 0 e peso 10 está ok."   , eval(testarGettersNota(10  ,  0  )), igual([10  ,  0  ]), testOk),
        teste("Nota 10 e peso 0 está ok."   , eval(testarGettersNota( 0  , 10  )), igual([ 0  , 10  ]), testOk),
        teste("Nota 5 e peso 5 está ok."    , eval(testarGettersNota( 5  ,  5  )), igual([ 5  ,  5  ]), testOk),
    ]);

    // Exercício 3.

    grupo("Exercício 3", "Getter da Nota ponderada").maximo(0.2).testes([
        teste("Nota 10 e peso 10 dá 10."    , () => new Nota(10  , 10  ).notaPonderada, igual(10   ), testOk),
        teste("Nota 8 e peso 4 dá 3.2."     , () => new Nota( 8  ,  4  ).notaPonderada, igual( 3.2 ), testOk),
        teste("Nota 2 e peso 3 dá 0.6."     , () => new Nota( 2  ,  3  ).notaPonderada, igual( 0.6 ), testOk),
        teste("Nota 7.8 e peso 2.5 dá 1.95.", () => new Nota( 7.8,  2.5).notaPonderada, igual( 1.95), testOk),
        teste("Nota 0 e peso 10 está ok."   , () => new Nota(10  ,  0  ).notaPonderada, igual( 0   ), testOk),
        teste("Nota 10 e peso 0 está ok."   , () => new Nota( 0  , 10  ).notaPonderada, igual( 0   ), testOk),
        teste("Nota 5 e peso 5 está ok."    , () => new Nota( 5  ,  5  ).notaPonderada, igual( 2.5 ), testOk),
    ]);

    grupo("Exercícios 2 e 3 - sem setters", "A classe Nota não tem setters ").maximo(0.2).testes([
        teste("Não pode setar valor."         , eval(mexer("new Nota(5, 7)", v => `${v}.valor = 8        `, v => `${v}.valor         !== 5  `)), naoDeuErro(), testOk),
        teste("Não pode setar peso."          , eval(mexer("new Nota(5, 7)", v => `${v}.peso = 8         `, v => `${v}.peso          !== 7  `)), naoDeuErro(), testOk),
        teste("Não pode setar nota ponderada.", eval(mexer("new Nota(5, 7)", v => `${v}.notaPonderada = 8`, v => `${v}.notaPonderada !== 3.5`)), naoDeuErro(), testOk),
    ]);

    // Exercício 4.

    grupo("Exercício 4", "Método toString() da Nota.").maximo(0.2).testes([
        teste("Nota 10 e peso 10 está ok."  , () => "" + new Nota(10  , 10  ), igual("nota = 10, peso = 10"  ), testOk),
        teste("Nota 8 e peso 4 está ok."    , () => "" + new Nota( 8  ,  4  ), igual("nota = 8, peso = 4"    ), testOk),
        teste("Nota 2 e peso 3 está ok."    , () => "" + new Nota( 2  ,  3  ), igual("nota = 2, peso = 3"    ), testOk),
        teste("Nota 7.8 e peso 2.5 está ok.", () => "" + new Nota( 7.8,  2.5), igual("nota = 7.8, peso = 2.5"), testOk),
        teste("Nota 0 e peso 10 está ok."   , () => "" + new Nota(10  ,  0  ), igual("nota = 10, peso = 0"   ), testOk),
        teste("Nota 10 e peso 0 está ok."   , () => "" + new Nota( 0  , 10  ), igual("nota = 0, peso = 10"   ), testOk),
        teste("Nota 5 e peso 5 está ok."    , () => "" + new Nota( 5  ,  5  ), igual("nota = 5, peso = 5"    ), testOk),
    ]);

    // Usado em todos os exercícios do 5 ao 13.
    const alunosMatriculasValidos = [
        {
            criar: () => new AlunoMatricula("Maria Luiza", "F", "Desenvolvimento de Aplicativos", Object.freeze([new Nota(8, 5), new Nota(9, 5)]), 84),
            json: {
                nome: "Maria Luiza", genero: "F", disciplina: "Desenvolvimento de Aplicativos", presenca: 84,
                media: 8.5, situacao: "AP", situacaoPorExtenso: "aprovada",
                status: "Maria Luiza tem média 8.5 na disciplina de Desenvolvimento de Aplicativos e foi aprovada com 84% de presença."
            },
            ados: () => [new Nota(8, 5), new Nota(9, 5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Roberto", "M", "Linguagens de Script para Web", Object.freeze([new Nota(3, 2.5), new Nota(4, 2.5), new Nota(6, 2.5), new Nota(2, 2.5)]), 80),
            json: {
                nome: "Roberto", genero: "M", disciplina: "Linguagens de Script para Web", presenca: 80,
                media: 3.75, situacao: "RM", situacaoPorExtenso: "reprovado por média",
                status: "Roberto tem média 3.75 na disciplina de Linguagens de Script para Web e foi reprovado por média com 80% de presença."
            },
            ados: () => [new Nota(3, 2.5), new Nota(4, 2.5), new Nota(6, 2.5), new Nota(2, 2.5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Chiquinha", "F", "Química Orgânica III", Object.freeze([new Nota(8.5, 5), new Nota(9.5, 5)]), 21),
            json: {
                nome: "Chiquinha", genero: "F", disciplina: "Química Orgânica III", presenca: 21,
                media: 9, situacao: "RF", situacaoPorExtenso: "reprovada por falta",
                status: "Chiquinha tem média 9 na disciplina de Química Orgânica III e foi reprovada por falta com 21% de presença."
            },
            ados: () => [new Nota(8.5, 5), new Nota(9.5, 5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Bozoliro", "M", "presidência, governo e chefe de estado", Object.freeze([new Nota(1, 4), new Nota(2.5, 4), new Nota(1.5, 2)]), 22),
            json: {
                nome: "Bozoliro", genero: "M", disciplina: "presidência, governo e chefe de estado", presenca: 22,
                media: 1.7, situacao: "RMF", situacaoPorExtenso: "reprovado por média e falta",
                status: "Bozoliro tem média 1.7 na disciplina de presidência, governo e chefe de estado e foi reprovado por média e falta com 22% de presença."
            },
            ados: () => [new Nota(1, 4), new Nota(2.5, 4), new Nota(1.5, 2)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Molusco da Silva", "M", "presidência, governo e chefe de estado", Object.freeze([new Nota(9, 2.5), new Nota(9, 2.5), new Nota(10, 5)]), 88),
            json: {
                nome: "Molusco da Silva", genero: "M", disciplina: "presidência, governo e chefe de estado", presenca: 88,
                media: 9.5, situacao: "AP", situacaoPorExtenso: "aprovado",
                status: "Molusco da Silva tem média 9.5 na disciplina de presidência, governo e chefe de estado e foi aprovado com 88% de presença."
            },
            ados: () => [new Nota(9, 2.5), new Nota(9, 2.5), new Nota(10, 5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Bruxa do 71", "F", "atriz de novela mexicana", Object.freeze([new Nota(0.71, 5), new Nota(0.71, 5)]), 71),
            json: {
                nome: "Bruxa do 71", genero: "F", disciplina: "atriz de novela mexicana", presenca: 71,
                media: 0.71, situacao: "RMF", situacaoPorExtenso: "reprovada por média e falta",
                status: "Bruxa do 71 tem média 0.71 na disciplina de atriz de novela mexicana e foi reprovada por média e falta com 71% de presença."
            },
            ados: () => [new Nota(0.71, 5), new Nota(0.71, 5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Chuck Norris", "M", "Ator", Object.freeze([new Nota(10, 5), new Nota(10, 5)]), 100),
            json: {
                nome: "Chuck Norris", genero: "M", disciplina: "Ator", presenca: 100,
                media: 10, situacao: "AP", situacaoPorExtenso: "aprovado",
                status: "Chuck Norris tem média 10 na disciplina de Ator e foi aprovado com 100% de presença."
            },
            ados: () => [new Nota(10, 5), new Nota(10, 5)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Dollynho", "M", "Seu amiguinho", Object.freeze([new Nota(10, 3), new Nota(10, 4), new Nota(10, 3)]), 0),
            json: {
                nome: "Dollynho", genero: "M", disciplina: "Seu amiguinho", presenca: 0,
                media: 10, situacao: "RF", situacaoPorExtenso: "reprovado por falta",
                status: "Dollynho tem média 10 na disciplina de Seu amiguinho e foi reprovado por falta com 0% de presença."
            },
            ados: () => [new Nota(10, 3), new Nota(10, 4), new Nota(10, 3)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Dollynha", "F", "Sua amiguinha", Object.freeze([new Nota(0, 3), new Nota(0, 3), new Nota(0, 4)]), 100),
            json: {
                nome: "Dollynha", genero: "F", disciplina: "Sua amiguinha", presenca: 100,
                media: 0, situacao: "RM", situacaoPorExtenso: "reprovada por média",
                status: "Dollynha tem média 0 na disciplina de Sua amiguinha e foi reprovada por média com 100% de presença."
            },
            ados: () => [new Nota(0, 3), new Nota(0, 3), new Nota(0, 4)],
            instanciavel: false
        },
        {
            criar: () => new AlunoMatricula("Zerinho", "M", "fazer algo útil", Object.freeze([new Nota(0, 10)]), 0),
            json: {
                nome: "Zerinho", genero: "M", disciplina: "fazer algo útil", presenca: 0,
                media: 0, situacao: "RMF", situacaoPorExtenso: "reprovado por média e falta",
                status: "Zerinho tem média 0 na disciplina de fazer algo útil e foi reprovado por média e falta com 0% de presença."
            },
            ados: () => [new Nota(0, 10)],
            instanciavel: false
        }
    ];

    const alunosMatriculasInvalidos = [];
    const alunosMatriculasInvalidosConstrutorApenas = [];
    ["new Abacaxi()", "undefined", "NaN", "null", "true", "5", "999", "(function kkk() {})", '{"vai": "dar pau"}'].forEach(lixo => {
        alunosMatriculasInvalidosConstrutorApenas.push({
            criar: `() => FUNC(${lixo}, "F", "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "TypeError",
            causa: `o nome inválido ${lixo}`,
        });
        alunosMatriculasInvalidosConstrutorApenas.push({
            criar: `() => FUNC("Teste", ${lixo}, "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "TypeError",
            causa: `o gênero inválido ${lixo}`,
        });
        alunosMatriculasInvalidosConstrutorApenas.push({
            criar: `() => FUNC("Teste", "M", ${lixo}, Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "TypeError",
            causa: `a disciplina inválida ${lixo}`,
        });
    });
    ['""', '"   "', '"U"', '"FGH"', '"xxx"', '"A"'].forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", ${lixo}, "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "RangeError",
            detalhe: "Escolha o gênero do(a) aluno(a) corretamente.",
            causa: `o gênero inválido ${lixo}`,
        });
    });

    ["", "   "].forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("${lixo}", "M", "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "RangeError",
            detalhe: "Informe o nome do(a) aluno(a) corretamente.",
            causa: `o nome inválido "${lixo}"`,
        });
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", "F", "${lixo}", Object.freeze([new Nota(10, 10)]), 84)`,
            erro: "RangeError",
            detalhe: "Informe o nome da disciplina corretamente.",
            causa: `a disciplina inválida "${lixo}"`,
        });
    });

    function fake(valor, peso) {
        class Nota {}
        const n = new Nota();
        n.valor = valor;
        n.peso = peso;
        return n;
    }

    const adosLixo1 = [
        "[new Nota(5, 5), fake('abacaxi', 5), new Nota(5, 5)]",
        "[new Nota(5, 5), fake('', 5), new Nota(5, 5)]",
        "[fake('macaco', 5)]",
        "[fake('cachorro', 'papagaio')]",
        "[fake('', '')]",
        "[fake(-5, 4), new Nota(2, 5), new Nota(3, 5)]",
        "[fake(12, 4), new Nota(2, 5)]",
        "[fake(12, 4), fake(-2, 4)]",
        "[fake(444, 444)]",
        "[fake(NaN, 5)]",
        "[fake(Infinity, 5)]",
        "[fake(null, 5)]",
        "[fake(undefined, 5)]",
    ];
    const adosLixo2 = [
        "[new Nota(5, 5), fake(5, 'batata'), new Nota(5, 5)]",
        "[new Nota(5, 5), fake(5, ''), new Nota(5, 5)]",
        "[fake(5, 'gato')]",
        "[fake(5, NaN)]",
        "[fake(5, undefined)]",
        "[fake(5, Infinity)]",
        "[fake(5, null)]",
        "[fake(4, 4), fake(6, -1)]",
        "[fake(4, 4), fake(6, 11)]"
    ];
    const adosLixo3 = [
        "[]",
        "[new Nota(5, 5)]",
        "[new Nota(5, 5), new Nota(6, 6)]",
        "[new Nota(1, 1), new Nota(2, 2), new Nota(3, 3)]"
    ];
    adosLixo1.forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", "F", "Teste", ${lixo}, 84)`,
            erro: "TypeError",
            detalhe: "Informe a nota corretamente.",
            causa: `a lista de ADOs inválida ${lixo}`,
        });
    });
    adosLixo2.forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", "F", "Teste", ${lixo}, 84)`,
            erro: "TypeError",
            detalhe: "Informe o peso corretamente.",
            causa: `a lista de ADOs inválida ${lixo}`,
        });
    });
    adosLixo3.forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", "F", "Teste", ${lixo}, 84)`,
            erro: "RangeError",
            detalhe: "O peso das notas deve somar 10.",
            causa: `a lista de ADOs inválida ${lixo}`,
        });
    });
    ['""', '"   "', "NaN", "undefined", '"abc"', "new Abacaxi()", "new Nota(5, 5)", "true", "[1, 2]", "[new Nota(10, 10)]", '{"vai dar": "pau"}', '["vai", "dar", "pau"]'].forEach(lixo => {
        alunosMatriculasInvalidosConstrutorApenas.push({
            criar: `() => FUNC("Teste", "F", "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), ${lixo})`,
            erro: "TypeError",
            causa: `o valor inválido ${lixo} para a presença`,
        });
    });
    ["-1", "-0.5", "100.5", "109", "999999", "-999"].forEach(lixo => {
        alunosMatriculasInvalidos.push({
            criar: `() => FUNC("Teste", "F", "Desenvolvimento Web", Object.freeze([new Nota(10, 10)]), ${lixo})`,
            erro: "RangeError",
            detalhe: "Informe a presença corretamente.",
            causa: `o valor inválido ${lixo} para a presença`,
        });
    });

    // Exercício 5.
    const testes5p1 = [];
    alunosMatriculasValidos.forEach(aluno =>
        testes5p1.push(
            teste(
                `Deve conseguir instanciar AlunoMatricula corretamente [${aluno.json.nome}].`,
                aluno.criar,
                naoDeuErro(),
                testOk,
                ok => aluno.instanciavel = ok
            )
        )
    );
    grupo("Exercício 5 - parte 1 (caminho feliz - entrada válida)", "Construtor de AlunoMatricula").maximo(0.6).testes(testes5p1);

    function testarConstrutorAlunoMatricula(params, erro) {
        return ``
                + `() => (() => {\n`
                + `    try {\n`
                + `        new AlunoMatricula${params};\n`
                + `    } catch (e) {\n`
                + `        if (!(e instanceof ${erro}) || [null, undefined, ""].includes(e?.message?.trim())) throw e; // Não era a exceção que devia ter sido.\n`
                + `        return;\n`
                + `    }\n`
                + `    throw new Error("O construtor de AlunoMatricula aceitou porcaria.");\n`
                + `})()`;
    }

    function testarErro(valor, peso) {
        return ``
                + `() => (() => {\n`
                + `    const n = new Nota(${valor}, ${peso});\n`
                + `    return [n.valor, n.peso];\n`
                + `})()`;
    }

    const testes5p2 = [];
    [alunosMatriculasInvalidos, alunosMatriculasInvalidosConstrutorApenas].forEach(lista => {
        lista.forEach(aluno =>
            testes5p2.push(
                teste(
                    `Não deve conseguir instanciar AlunoMatricula com [${aluno.causa}].`,
                    eval(testarConstrutorAlunoMatricula(aluno.criar.replace("() => FUNC", ""), aluno.erro)),
                    naoDeuErro(),
                    testOk
                )
            )
        );
    });
    grupo("Exercício 5 - parte 2 (caminho infeliz - entrada inválida)", "Construtor de AlunoMatricula").maximo(1).testes(testes5p2);

    // Exercício 6.

    function ados(aluno) {
        return status => {
            if (["mostrando antes", "mostrando depois"].includes(status)) return aluno.ados.toString().replace("() => ", "");
            try {
                return aluno.ados();
            } catch (e) {
                return "Nota não está funcionando ainda: " + e
            }
        };
    }

    const testes6 = [];
    const artigos = {nome: "o", genero: "o", disciplina: "a", presenca: "a"};
    ["nome", "genero", "disciplina", "presenca"].forEach(getter => {
        alunosMatriculasValidos.forEach(aluno =>
            testes6.push(
                teste(
                    `Deve conseguir obter ${artigos[getter]} ${getter} de uma instância de AlunoMatricula corretamente [${aluno.json.nome}].`,
                    eval(aluno.criar.toString() + "." + getter),
                    igual(aluno.json[getter]),
                    () => nomesOk && aluno.instanciavel,
                    ok => aluno["funciona" + getter] = ok
                )
            )
        );
    });
    alunosMatriculasValidos.forEach(aluno =>
        testes6.push(
            teste(
                `Deve conseguir obter os ADOs de uma instância de AlunoMatricula corretamente [${aluno.json.nome}].`,
                eval(aluno.criar.toString() + ".ados"),
                igual(ados(aluno)),
                () => nomesOk && aluno.instanciavel,
                ok => aluno["funcionaados"] = ok
            )
        )
    );
    grupo("Exercício 6", "Getters simples da classe AlunoMatricula").maximo(0.3).testes(testes6);

    // Exercícos 7 a 10.

    const ex7_10 = [
        ["media", 7, "média", "a"],
        ["situacao", 8, "situação", "a"],
        ["situacaoPorExtenso", 9, "situação por extenso", "a"],
        ["status", 10, "status", "o"]
    ];

    ex7_10.forEach(exercicio => {
        const [getter, numero, nome, artigo] = exercicio;
        const testes7_10 = [];
        alunosMatriculasValidos.forEach(aluno =>
            testes7_10.push(
                teste(
                    `Deve conseguir obter ${artigo} ${nome} de uma instância de AlunoMatricula corretamente [${aluno.json.nome}].`,
                    eval(aluno.criar.toString() + "." + getter),
                    igual(aluno.json[getter]),
                    () => nomesOk && aluno.instanciavel,
                    ok => aluno["funciona" + getter] = ok
                )
            )
        );
        grupo(`Exercício ${numero}`, `Getter d${artigo} ${nome} na classe AlunoMatricula`).maximo(0.4).testes(testes7_10);
    });

    grupo("Exercícios 6 a 10 - sem setters", "A classe AlunoMatricula não tem setters ").maximo(0.2).testes([
        teste("Não pode setar nome."                , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.nome       = "x" `                        , v => `${v}.nome        !== "a" `                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar gênero."              , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.genero     = "F" `                        , v => `${v}.genero      !== "M" `                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar disciplina."          , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.disciplina = "x" `                        , v => `${v}.disciplina  !== "b" `                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar presença."            , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.presenca   = 89  `                        , v => `${v}.presenca    !== 77  `                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar média."               , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.media      = 8   `                        , v => `${v}.media       !== 5   `                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar situação."            , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.situacao   = "AP"`                        , v => `${v}.situacao    !== "RM"`                                                     )), naoDeuErro(), testOk),
        teste("Não pode setar situação por extenso.", eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.situacaoPorExtenso = "aprovado"`          , v => `${v}.situacaoPorExtenso !== "reprovado por média"`                             )), naoDeuErro(), testOk),
        teste("Não pode setar ADOs."                , eval(mexer('new AlunoMatricula("a", "M", "b", [new Nota(5, 10)], 77)', v => `${v}.ados = [new Nota(9, 10), new Nota(9, 10)]`, v => `${v}.ados.length !== 1 || ${v}.ados[0].valor !== 5 || ${v}.ados[0].peso !== 10`)), naoDeuErro(), testOk),
    ]);

    // Exercícios 11 e 12.

    function verificarEstruturaUl() {
        let ids = [];
        function incluirId(elems) {
            for (const elem of elems) {
                const id = elem.id;
                if (!id) return;
                if (ids.includes(id)) throw new Error(`Algo bagunçou no DOM. O id ${id} está repetido.`);
                ids.push(id);
            }
        }
        const ul = document.querySelector(".ex11a13 > ul");
        incluirId([ul]);
        [...ul.children].forEach((e, i) => {
            const li = ul.children[i];
            if (li.tagName !== "LI") throw new Error(`Algo bagunçou no DOM. O <ul> tem um filho ${i} que não é <li>.`);
            if (li.children.length !== 2) throw new Error(`Algo bagunçou no DOM. O <li> ${i} não tem exatamente dois filhos.`);
            const div1 = li.children[0];
            const div2 = li.children[1];
            if (div1.tagName !== "DIV") throw new Error(`Algo bagunçou no DOM. O primeiro filho do <li> ${i} não é <div>`);
            if (div2.tagName !== "DIV") throw new Error(`Algo bagunçou no DOM. O segundo filho do <li> ${i} não é <div>`);
            if (div1.children.length !== 2) throw new Error(`Algo bagunçou no DOM. O primeiro <div> do <li> ${i} não tem exatemente dois filhos.`);
            if (div2.children.length !== 2) throw new Error(`Algo bagunçou no DOM. O segundo <div> do <li> ${i} não tem exatemente dois filhos.`);
            const label1 = div1.children[0];
            const label2 = div2.children[0];
            const input1 = div1.children[1];
            const input2 = div2.children[1];
            if (label1.tagName !== "LABEL") throw new Error(`Algo bagunçou no DOM. O primeiro filho do primeiro <div> do <li> ${i} não é <label>.`);
            if (label2.tagName !== "LABEL") throw new Error(`Algo bagunçou no DOM. O primeiro filho do segundo <div> do <li> ${i} não é <label>.`);
            if (input1.tagName !== "INPUT") throw new Error(`Algo bagunçou no DOM. O segundo filho do primeiro <div> do <li> ${i} não é <input>.`);
            if (input2.tagName !== "INPUT") throw new Error(`Algo bagunçou no DOM. O segundo filho do segundo <div> do <li> ${i} não é <input>.`);
            if (label1.innerHTML !== "Nota:") throw new Error(`Algo bagunçou no DOM. O primeiro <label> no <li> ${i} não é "Nota:".`);
            if (label2.innerHTML !== "Peso:") throw new Error(`Algo bagunçou no DOM. O primeiro <label> no <li> ${i} não é "Peso:".`);
            if (!label1.attributes["for"]) throw new Error(`Algo bagunçou no DOM. O primeiro <label> no <li> ${i} não tem o atributo "for".`);
            if (!label2.attributes["for"]) throw new Error(`Algo bagunçou no DOM. O segundo <label> no <li> ${i} não tem o atributo "for".`);
            if (!input1.attributes["type"]) throw new Error(`Algo bagunçou no DOM. O primeiro <input> no <li> ${i} não tem o atributo "type".`);
            if (!input2.attributes["type"]) throw new Error(`Algo bagunçou no DOM. O segundo <input> no <li> ${i} não tem o atributo "type".`);
            if (input1.attributes["type"].nodeValue !== "text") throw new Error(`Algo bagunçou no DOM. O primeiro <input> no <li> ${i} não tem o "type" como "text".`);
            if (input2.attributes["type"].nodeValue !== "text") throw new Error(`Algo bagunçou no DOM. O segundo <input> no <li> ${i} não tem o "type" como "text".`);
            if (!input1.id) throw new Error(`Algo bagunçou no DOM. O primeiro <input> no <li> ${i} não tem o atributo "id".`);
            if (!input2.id) throw new Error(`Algo bagunçou no DOM. O segundo <input> no <li> ${i} não tem o atributo "id".`);
            const id1 = input1.id;
            const id2 = input2.id;
            if (label1.attributes["for"].nodeValue !== id1) throw new Error(`Algo bagunçou no DOM. O primeiro <label> no <li> ${i} não aponta ao <input> correspondente.`);
            if (label2.attributes["for"].nodeValue !== id2) throw new Error(`Algo bagunçou no DOM. O segundo <label> no <li> ${i} não aponta ao <input> correspondente.`);
            incluirId([li, div1, div2, label1, label2, input1, input2]);
        });
    }

    function verificarAlteracao(sinal) {
        if (sinal !== "+" && sinal !== "-") throw new Error("Só aceita + e -.");
        const delta = sinal === "+" ? 1 : -1;
        verificarEstruturaUl();
        const valores = [];
        const ul = document.querySelector(".ex11a13 > ul");
        [...ul.children].forEach((e, i) => {
            const li = ul.children[i];
            const a = li.querySelectorAll("input")[0].value;
            const b = li.querySelectorAll("input")[1].value;
            valores.push([a, b]);
        });
        const antes = ul.children.length;
        const botao = document.getElementById(sinal === "+" ? "botao-mais-nota" : "botao-menos-nota");
        const old = botao.onclick;
        try {
            let crash;
            botao.onclick = function() {
                try {
                    old();
                } catch (e) {
                    crash = e;
                }
            };
            botao.click();
            if (crash) throw crash;
        } finally {
            botao.onclick = old;
        }
        valores.push(["", ""]);
        [...ul.children].forEach((e, i) => {
            const li = ul.children[i];
            if (li.querySelectorAll("input")[0].value !== valores[i][0]) throw new Error(`Algo bagunçou no DOM. O valor no primeiro <input> do <li> ${i} não é o esperado.`);
            if (li.querySelectorAll("input")[1].value !== valores[i][1]) throw new Error(`Algo bagunçou no DOM. O valor no segundo <input> do <li> ${i} não é o esperado.`);
        });
        verificarEstruturaUl();
        const tem = document.querySelector(".ex11a13 > ul").children.length;
        const deveTer = Math.max(0, antes + delta);
        if (tem !== deveTer) throw new Error(`Algo bagunçou no DOM. A quantidade de <li>'s dentro do <ul> não é a esperada (tem ${tem}, mas devia ter ${deveTer}).`);
    }

    function verificarAlteracoes(mudancas) {
        try {
            for (const mudanca of mudancas.split("")) {
                verificarAlteracao(mudanca);
            }
        } finally {
            limparForm11a13();
        }
    }

    grupo("Exercícios 11 e 12", "Quantidade de elementos de Nota no DOM").maximo(1).testes([
        teste("Adiciona um item."                    , () => verificarAlteracoes("+"), naoDeuErro(), testOk),
        teste("Remove o item."                       , () => verificarAlteracoes("-"), naoDeuErro(), testOk),
        teste("Adiciona um item e remove."           , () => verificarAlteracoes("+-"), naoDeuErro(), testOk),
        teste("Remove um item e adiciona."           , () => verificarAlteracoes("-+"), naoDeuErro(), testOk),
        teste("Adiciona um montão."                  , () => verificarAlteracoes("++++++"), naoDeuErro(), testOk),
        teste("Adiciona e remove um montão."         , () => verificarAlteracoes("++-+-++-+--+"), naoDeuErro(), testOk),
        teste("Remove com a fila vazia."             , () => verificarAlteracoes("--"), naoDeuErro(), testOk),
        teste("Remove com a fila vazia várias vezes.", () => verificarAlteracoes("-----"), naoDeuErro(), testOk),
        teste("Bagunça total."                       , () => verificarAlteracoes("---++-+--+++++---+-+---+++--------+++-+-+---++++++++------+-----+----+----"), naoDeuErro(), testOk),
    ]);

    // Exercício 13.

    function informarDados(nome, genero, disciplina, ados, presenca) {
        const bta = document.querySelector("#botao-menos-nota"), oldClickA = bta.onclick;
        const btb = document.querySelector("#botao-mais-nota") , oldClickB = btb.onclick;
        const btc = document.querySelector("#botao-cadastrar") , oldClickC = btc.onclick;
        let crash = null;

        bta.onclick = function() {
            try {
                oldClickA();
            } catch (e) {
                crash = e;
            }
        };
        btb.onclick = function() {
            try {
                oldClickB();
            } catch (e) {
                crash = e;
            }
        };
        btc.onclick = function() {
            try {
                oldClickC();
            } catch (e) {
                crash = e;
            }
        };

        try {
            document.querySelector("#nome").value = nome;
            document.querySelector("#ele").checked = genero === "M";
            document.querySelector("#ela").checked = genero === "F";
            document.querySelector("#disciplina").value = disciplina;

            if (ados.length === 0) {
                bta.click();
                if (crash) throw crash;
            } else {
                for (let x = 1; x < ados.length; x++) {
                    btb.click();
                    if (crash) throw crash;
                }
            }

            ados.forEach((e, i) => {
                const li = document.querySelectorAll(".ex11a13 > ul > li")[i];
                li.querySelectorAll("input")[0].value = "" + e.valor;
                li.querySelectorAll("input")[1].value = "" + e.peso;
            });

            document.querySelector("#presenca").value = "" + presenca;
            btc.click();
            if (crash) throw crash;
            return document.querySelector("#situacao").value;
        } catch (e) {
            if (e instanceof NaoImplementadoAinda || e instanceof PularTeste) throw e;
            try {
                console.log(e);
                return determinarTipo2(e) + (e.message.trim().length > 0 ? " com mensagem" : " sem mensagem");
            } catch (e2) {
                return determinarTipo2(e);
            }
        } finally {
            bta.onclick = oldClickA;
            btb.onclick = oldClickB;
            btc.onclick = oldClickC;
            limparForm11a13();
        }
    }

    const testes13p1 = alunosMatriculasValidos.map(aluno =>
        teste(
            `Deve conseguir preencher uma instância de AlunoMatricula corretamente no formulário [${aluno.json.nome}].`,
            eval(aluno.criar.toString().replace("new AlunoMatricula", "informarDados")),
            igual(aluno.json.status),
            () => nomesOk && aluno.funcionastatus
        )
    );

    const testes13p2 = alunosMatriculasInvalidos.map((aluno, i) =>
        teste(
            `Não deve conseguir preencher uma instância de AlunoMatricula com ${aluno.causa} [${i + 1}].`,
            eval(aluno.criar.replace("FUNC", "informarDados")),
            igual(aluno.detalhe),
            testOk
        )
    );

    grupo("Exercício 13 - parte 1 (caminho feliz - entrada válida)"    , "Formulário com AlunoMatricula - preenchido corretamente").maximo(1).testes(testes13p1);
    grupo("Exercício 13 - parte 2 (caminho infeliz - entrada inválida)", "Formulário com AlunoMatricula - preenchimento incorreto").maximo(1).testes(testes13p2);

    // Teste de efeitos colaterais dos exercícios 4 ao 13.

    function testarEfeitosColaterais(coisa, jsonBase) {
        const doido = a => random.embaralhar(a);
        const keys = Object.keys(jsonBase).sort();
        const json1 = jsonBase;
        const json2 = Utilitarios.extractGetters(coisa);
        const json3 = Utilitarios.extractGetters(coisa, a => a.sort());
        const json4 = Utilitarios.extractGetters(coisa, a => a.sort().reverse());
        const json5 = Utilitarios.extractGetters(coisa, doido);
        const json6 = Utilitarios.extractGetters(coisa, doido);
        const json7 = Utilitarios.extractGetters(coisa, doido);

        igual(json1).testar(json2);
        igual(json1).testar(json3);
        igual(json1).testar(json4);
        igual(json2).testar(json3);
        igual(json2).testar(json4);
        igual(json3).testar(json4);
        igual(json1).testar(json5);
        igual(json1).testar(json6);
        igual(json1).testar(json7);
    }

    function fnColaterais1(params) {
        return ``
                + `() => (() => {\n`
                + `    const n = new Nota(${params});\n`
                + `    const r = {"notaPonderada": n.notaPonderada, "valor": n.valor, "peso": n.peso};\n`
                + `    testarEfeitosColaterais(n, r);\n`
                + `})()`;
    }

    const testesColaterais1 = ["4, 8", "7, 3", "0, 4", "10, 2", "10, 0"].map((params, i) =>
        teste(
            `Deve se certificar que chamar os getters de Nota não causa efeitos colaterais estranhos [${i}].`,
            eval(fnColaterais1(params)),
            naoDeuErro(),
            testOk
        )
    );

    function fnColaterais2(aluno) {
        return ``
                + `() => (() => {\n`
                + `    const n = ${aluno.criar.toString().replace("() => ", "")};\n`
                + `    const r = ${Utilitarios.stringify(aluno.json)};\n`
                + `    r.ados = ${aluno.ados.toString().replace("() => ", "")};\n`
                + `    testarEfeitosColaterais(n, r);\n`
                + `})()`;
    }

    const testesColaterais2 = alunosMatriculasValidos.map(aluno =>
        teste(
            `Deve se certificar que chamar os getters de AlunoMatricula não causa efeitos colaterais estranhos [${aluno.json.nome}].`,
            eval(fnColaterais2(aluno)),
            naoDeuErro(),
            () => nomesOk && aluno.funcionastatus
        )
    );

    grupo("Exercícios 2 a 4 - testar efeitos colaterais indesejados em Nota", "Getters não devem causar efeitos colaterais").maximo(0.2).testes(testesColaterais1);
    grupo("Exercícios 6 a 10 - testar efeitos colaterais indesejados em AlunoMatricula", "Getters não devem causar efeitos colaterais").maximo(0.2).testes(testesColaterais2);

    // Exercício 14.

    try {
        const x = Circulo;
    } catch (e) {
        if (e instanceof ReferenceError) {
            window.Circulo = function() {
                naoFizIssoAinda();
            }
        }
    }

    grupo("Exercício 14 - parte 1 (caminho feliz)", "Construtor de Circulo").maximo(0.4).testes([
        teste("Raio 10 está ok."    , () => new Circulo(  10   ), naoDeuErro(), testOk),
        teste("Raio 35.25 está ok." , () => new Circulo(  35.25), naoDeuErro(), testOk),
        teste("Raio 9876.5 está ok.", () => new Circulo(9876.5 ), naoDeuErro(), testOk),
        teste("Raio 0 está ok."     , () => new Circulo(   0   ), naoDeuErro(), testOk)
    ]);

    function testarConstrutorCirculo(erro, raio) {
        return ``
                + `() => (() => {\n`
                + `    try {\n`
                + `        new Circulo(${raio});\n`
                + `    } catch (e) {\n`
                + `        if (!(e instanceof ${erro.name})) throw e; // Não era a exceção que devia ter sido.\n`
                + `        return;\n`
                + `    }\n`
                + `    throw new Error("O construtor de Circulo aceitou porcaria.");\n`
                + `})()`;
    }

    grupo("Exercício 14 - parte 2 (caminho infeliz)", "Construtor de Circulo com parâmetros de tipo inválido").maximo(0.3).testes([
        teste("Circulo null não está ok."     , eval(testarConstrutorCirculo(TypeError , null           )), naoDeuErro(), testOk),
        teste("Circulo undefined não está ok.", eval(testarConstrutorCirculo(TypeError , undefined      )), naoDeuErro(), testOk),
        teste("Circulo NaN não está ok."      , eval(testarConstrutorCirculo(TypeError , NaN            )), naoDeuErro(), testOk),
        teste("Circulo string não está ok."   , eval(testarConstrutorCirculo(TypeError , '"bug bug"'    )), naoDeuErro(), testOk),
        teste("Circulo objeto não está ok."   , eval(testarConstrutorCirculo(TypeError , '{bug: "x"}'   )), naoDeuErro(), testOk),
        teste("Circulo abacaxi não está ok."  , eval(testarConstrutorCirculo(TypeError , 'new Abacaxi()')), naoDeuErro(), testOk),
        teste("Circulo infinito não está ok." , eval(testarConstrutorCirculo(TypeError , Infinity       )), naoDeuErro(), testOk),
        teste("Circulo -infinito não está ok.", eval(testarConstrutorCirculo(TypeError , -Infinity      )), naoDeuErro(), testOk),
        teste("Circulo -5 não está ok."       , eval(testarConstrutorCirculo(RangeError, -5             )), naoDeuErro(), testOk),
        teste("Circulo -0.01 não está ok."    , eval(testarConstrutorCirculo(RangeError, -0.01          )), naoDeuErro(), testOk)
    ]);

    function testarGettersCirculo(raio) {
        return ``
                + `() => (() => {\n`
                + `    const c = new Circulo(${raio});\n`
                + `    return [c.raio, c.diametro, c.area, c.circunferencia];\n`
                + `})()`;
    }

    grupo("Exercício 14 - parte 3 (getters)", "Getters de Circulo").maximo(0.2).testes([
        teste("Raio 10 está ok."      , eval(testarGettersCirculo(  10   )), igual([  10   ,    20  ,      100      * Math.PI,    20   * Math.PI]), testOk),
        teste("Raio 35.25 está ok."   , eval(testarGettersCirculo(  35.25)), igual([  35.25,    70.5,     1242.5625 * Math.PI,    70.5 * Math.PI]), testOk),
        teste("Raio 9876.5 está ok."  , eval(testarGettersCirculo(9876.5 )), igual([9876.5 , 19753  , 97545252.25   * Math.PI, 19753   * Math.PI]), testOk),
        teste("Raio 0 está ok."       , eval(testarGettersCirculo(   0   )), igual([   0   ,     0  ,        0               ,     0            ]), testOk)
    ]);

    grupo("Exercício 14 - parte 4 (sem setters)", "A classe Circulo não tem setters ").maximo(0.1).testes([
        teste("Não pode setar raio."          , eval(mexer("new Circulo(10)", v => `${v}.raio           = 8`, v => `${v}.raio           !==  10          `)), naoDeuErro(), testOk),
        teste("Não pode setar diâmetro."      , eval(mexer("new Circulo(10)", v => `${v}.diametro       = 8`, v => `${v}.diametro       !==  20          `)), naoDeuErro(), testOk),
        teste("Não pode setar área."          , eval(mexer("new Circulo(10)", v => `${v}.area           = 8`, v => `${v}.area           !== 100 * Math.PI`)), naoDeuErro(), testOk),
        teste("Não pode setar circunferência.", eval(mexer("new Circulo(10)", v => `${v}.circunferencia = 8`, v => `${v}.circunferencia !==  20 * Math.PI`)), naoDeuErro(), testOk)
    ]);

    window.verificarAlteracao = verificarAlteracao;
    window.verificarAlteracoes = verificarAlteracoes;
    window.testarEfeitosColaterais = testarEfeitosColaterais;
});
