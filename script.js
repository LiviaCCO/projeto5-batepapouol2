const nomeUsuario = prompt("Qual o seu nome?");

//definições:
//const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
//let listaDados=0;
let postagemStatus;
let postagemMessage;
let postagemPrivate;
const chat = document.querySelector(".chat");

//A cada três segundos, atualizar as mensagens do servidor 

//setInterval(pegarDados, 3000);


//carregar as mensagens do servidor 
// exibi-las conforme layout fornecido.

function processarResposta(resposta) {
    
    console.log(resposta);

    const mensagem = resposta.data;

    console.log(mensagem);

    for(let i=0; i<mensagem.length; i++){

        //postando no chat para cada tipo de mensagem
        
        if(mensagem[i].type==="status"){
            postagemStatus =`
            <li class="post status">
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> ${mensagem[i].text}
            </li>
            ` 
            chat.innerHTML += postagemStatus;
        }

        else if (mensagem[i].type==="message"){
            postagemMessage = `
            <li class="post normal"> 
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
            </li>
            `
            chat.innerHTML += postagemMessage;
        }
        else if (mensagem[i].type==="private_message"){
            //Msg reservadas só devem ser exibidas 
            //se o nome do destinatário ou remetente for igual 
            // ao nome do usuário que está usando o chat 
            if((nomeUsuario == mensagem[i].from) || (nomeUsuario == mensagem[i].to)){
                postagemPrivate = `
                <li class="post reservado"> 
                <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> reservadamente para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
                </li>
                `
                chat.innerHTML += postagemPrivate;
            }
        }

        
    }
} 

//pegando os dados do API
pegarDados();

function pegarDados(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    //promessa;
    // para guardar o tamanho da lista de dados
    //listaDados = promessa.data.length;
    console.log(promessa);
    // se tudo estiver certo, irá rodar a função processarResposta()
    //promessa.then(processarResposta);
    promessa.then(processarResposta);
}





/////////////////////////
   //for(let i=0; i<mensagem.length; i++){

   // função atualizar
/* function atualizar(resposta){
    //promessa;
    const novaLista = resposta.data.length;

    const mensagem = resposta.data;
    
    console.log(novaLista);
    
 
} */

 /*   if (listaDados!=novaLista){
    
    for(let i=listaDados; i<novaLista; i++){
        
        if(mensagem[i].type==="status"){
            postagemStatus =`
            <li class="post status">
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> ${mensagem[i].text}
            </li>
            ` 
            chat.innerHTML += postagemStatus;
        }

        else if (mensagem[i].type==="message"){
            postagemMessage = `
            <li class="post normal"> 
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
            </li>
            `
            chat.innerHTML += postagemMessage;
        }
        else if (mensagem[i].type==="private_message"){
            postagemPrivate = `
            <li class="post reservado"> 
            <span style="color:#AAAAAA">(${mensagem[i].time})</span> <span style="font-weight:bold"> ${mensagem[i].from} </span> reservadamente para <span style="font-weight:bold"> ${mensagem[i].to} </span>: ${mensagem[i].text}
            </li>
            `
            chat.innerHTML += postagemPrivate;
        }
    }
    
    listaDados = novaLista;
} */

