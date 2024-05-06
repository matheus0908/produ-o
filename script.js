// Função para adicionar um novo registro
function adicionarRegistro() {
    var setor = document.getElementById("setor").value;
    var colaborador = document.getElementById("colaborador").value;
    var data = document.getElementById("data").value;
    var produtividadeStr = document.getElementById("produtividade").value;
    var produtividade = parseFloat(produtividadeStr.replace(',', '.')); // Converter vírgula para ponto e converter para número decimal

    // Verificar se todos os campos foram preenchidos
    if (setor && colaborador && data && produtividadeStr) {
        var registros = JSON.parse(localStorage.getItem("registros")) || [];

        if (!isNaN(produtividade)) { // Verificar se é um número válido
            // Verificar se o colaborador já possui um registro na mesma data
            var registroExistenteIndex = registros.findIndex(registro => registro.colaborador === colaborador && registro.data === data);

            if (registroExistenteIndex !== -1) {
                // Se existir um registro para o mesmo colaborador na mesma data, somar a produtividade
                registros[registroExistenteIndex].produtividade += produtividade;
            } else {
                // Caso contrário, adicionar um novo registro
                registros.push({
                    setor: setor,
                    colaborador: colaborador,
                    data: data,
                    produtividade: produtividade
                });
            }

            localStorage.setItem("registros", JSON.stringify(registros));

            atualizarTabela();
        } else {
            alert("Por favor, insira um número válido para a produtividade.");
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}




// Função para atualizar a tabela com os registros
function atualizarTabela() {
    var registros = JSON.parse(localStorage.getItem("registros"));

    // Verificar se há registros e se é um array
    if (registros && Array.isArray(registros)) {
        var tbody = document.getElementById("registrosBody");

        // Limpar o conteúdo atual da tabela
        tbody.innerHTML = "";

        // Adicionar os registros à tabela
        registros.forEach((registro, index) => {
            var tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${registro.setor}</td>
                <td>${registro.colaborador}</td>
                <td>${registro.data}</td>
                <td>${registro.produtividade}</td>
                <td><button onclick="excluirRegistro(${index})">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        console.log("Nenhum registro encontrado.");
    }
}

// Função para excluir um registro
function excluirRegistro(index) {
    var registros = JSON.parse(localStorage.getItem("registros"));

    if (registros && Array.isArray(registros)) {
        registros.splice(index, 1);
        localStorage.setItem("registros", JSON.stringify(registros));
        atualizarTabela();
    } else {
        console.log("Nenhum registro encontrado.");
    }
}
// Função para exportar os registros para o Excel
function exportarParaExcel() {
    var registros = JSON.parse(localStorage.getItem("registros")) || [];
    var csvContent = "data:text/csv;charset=utf-8,"
        + "Setor;Colaborador;Data;Produtividade\n"; // Usando ponto e vírgula como delimitador
    registros.forEach(registro => {
        var linha = `${registro.setor};${registro.colaborador};${registro.data};${registro.produtividade}\n`; // Usando ponto e vírgula como delimitador
        csvContent += linha;
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros.csv");
    document.body.appendChild(link); // necessário para Firefox
    link.click();
}


// Chamar a função para atualizar a tabela ao carregar a página
atualizarTabela();
