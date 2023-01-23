let nome = {};
let mensagem=[];
let usuario;
let pessoasChat=[];
let para;


// entrando na sala
// perguntar nome
function nomeUsuario(){

    document.querySelector(".telaEntrada").classList.add('escondido');
    usuario = document.querySelector("#name").value;
    
    //usuario = prompt("Qual o seu nome?");
    nome = {
        name: usuario
    }
    //Inserir o nome e enviar para o servidor
    const promessaNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);

    // Se servidor responder com sucesso, o usuário poderá entrar na sala;
    promessaNome.then(iniciandoChat); 

    // Se o servidor responder com erro, deve-se pedir para digitar outro nome, pois este já está em uso;
    promessaNome.catch(erro); 
}
//chamando a função pergunta nome.
//nomeUsuario();

function iniciandoChat(){
    //baixando chat
    pegarDados();
    // para avisar ao servidor a cada 5 segundos
    setInterval(manterConexao, 5000);
    //A cada 3 segundos, atualizar as mensagens do servidor 
    setInterval(pegarDados, 3000);
    // Atualizar lista de participantes a cada 10 segundos
    setInterval(participantes, 10000);
}

function erro(){
    alert("Este nome está sendo usado. Tente outro!");
    document.querySelector("#name").value="";
    document.querySelector(".telaEntrada").classList.remove('escondido');
    
}

//mantendo conexão a cada 5 segundos
function manterConexao(){
    const conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);

    conexao.then(verificarConexao);

    conexao.catch(erroConexao);
}

function verificarConexao(){
    console.log("Estabelecendo conexão - 5s")
}

function erroConexao(resposta){
    console.log('Erro na conexão');
    console.log(resposta);
    window.location.reload()
}

// baixando as msg
function pegarDados(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    
    console.log("Pegando msg");
    // se tudo estiver certo, irá rodar a função processarResposta()
    //promessa.then(processarResposta);
    promessa.then(processarResposta);
    promessa.catch(erroConexao);
}

// exibindo as msg
function processarResposta(resposta) {
   
    mensagem = resposta.data;
    const chat = document.querySelector(".chat");
    chat.innerHTML = "";

    for(let i=0; i<mensagem.length; i++){

        //postando no chat para cada tipo de mensagem
                
        if(mensagem[i].type==="status"){
            postagem =`
            <li data-test="message" class="post status">
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> ${mensagem[i].text}
            </li>
            `             
        }

        else if (mensagem[i].type==="message"){
            postagem = `
            <li data-test="message" class="post normal"> 
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
            </li>
            `
        }
        else if (mensagem[i].type==="private_message"){
            //Msg reservadas só devem ser exibidas 
            //se o nome do destinatário ou remetente for igual 
            // ao nome do usuário que está usando o chat 
            if((nomeUsuario == mensagem[i].from) || (nomeUsuario == mensagem[i].to)){
                postagem = `
                <li data-test="message" class="post reservado"> 
                <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> reservadamente para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
                </li>
                `
            }
        }
        chat.innerHTML += postagem;
        // para scrollar as msg novas
        const ultimaMsg = document.querySelector(".chat").lastElementChild;
        ultimaMsg.scrollIntoView();
        
    }
} 

//Para enviar msg

function enviarMsg(){
    let mensagemDigitada = document.querySelector("#text").value;
    console.log(mensagemDigitada);

    mensagem = {
        from: usuario,
        to: "Todos",
        text: mensagemDigitada,
        type: "message" // ou "private_message" para o bônus
    };
    const msg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
 
    
    // Se o servidor responder com sucesso, obter novamente as msg do servidor 
    // e atualizar o *chat;*
    msg.then(pegarDados);
    
    //mensagemDigitada.innerHTML = "";
    document.querySelector("#text").value = "";
    
    // Se o servidor responder com erro, 
    // a página deve ser atualizada (e voltar pra etapa de pedir o nome).
    msg.catch(atualizarPagina); 
}

//para atualizar página
function atualizarPagina(){
    console.log("entrou no erro de atualizar");
    window.location.reload()
}

//para enviar pressionando o enter

document.getElementById("text")
    .addEventListener("keyup", function(e) {
        if (e.code === 'Enter') {
            document.getElementById("icon").click();
        }
    });
 
document.getElementById("icon").onclick = function() {
    enviarMsg();
}

// para abrir sidebar
function sidebar(){
    document.querySelector(".sidebarAll").classList.toggle('escondido');
    participantes();
}

function participantes(){
    
    pessoas = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    // se tudo estiver certo, irá rodar a função processarResposta()
    //promessa.then(processarResposta);
    pessoas.then(conversar);
    pessoas.catch(erroConexao);  

}

function conversar(resposta){
    const listaPart = document.querySelector(".listaParticipantes");
    listaPart.innerHTML = `
    <li data-test="all" class="opcao1" onclick="contato(this)">
        <ion-icon name="people"></ion-icon>
        <div class="nome">Todos
            <ion-icon class="visivel" data-test="check" name="checkmark-outline"></ion-icon>
        </div>
        
    </li>
    `
    const lista = resposta.data;
    console.log(lista);

    for(let i=0; i<lista.length; i++){
        listaPart.innerHTML += `
        <li data-test="participant" class="opcao1" onclick="contato(this)">
            <ion-icon name="person-circle"></ion-icon>
            <div class="nome">${lista[i].name}
                <ion-icon class="opacity" data-test="check" name="checkmark-outline"></ion-icon>
            </div>
        </li>
        `
    }
}

/* function contato(escolhido){
    console.log(escolhido);
    const icon = document.querySelector(".opcao1 .visivel");
    console.log(icon)
    icon.classList.add('opacity');
    const esc = escolhido.querySelector("ion-icon").classList.remove('opacity');
    para = esc.innerHTML;
    console.log(para);
} */