const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')
const wrapperContainer = document.getElementById("wrapper")
const startButton = document.getElementById("start")

let currentAct = document.getElementById("current-act")

let state = {}

function startGame() {
    state = {}
    wrapperContainer.style="display: block"
    startButton.style="display: none"
    showTextNode("start")
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    textElement.innerText = textNode.text
    //Uses the object's currentAct variable inside the .innerHTML of the act title
    currentAct.innerHTML = textNode.currentAct
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }

    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button')
            button.innerText = option.text
            button.classList.add('btn')
            button.addEventListener('click', () => selectOption(option))

            // replaying title animation
            button.addEventListener('click', () => animateAct())

            optionButtonsElement.appendChild(button)

            // give vibrate property to any button referencing "Imadjinn"
            if(option.text.includes("Imadjinn")){
                button.classList.add('btn-special')
            }
            
            // give lighter color to any button indicating an action"
            if(option.text.includes("*")){
                button.style = 'color: hsl(17, 100%, 68%);'
            }

            // give special color to any button tagged as "important"
            if(option.important==true){
                button.style = 'color: rgb(50, 125, 184);'
            }
        }
    })

}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    state = Object.assign(state, option.setState)
    showTextNode(nextTextNodeId)

    if (currentAct.innerHTML == "undefined"){
        // currentAct.innerHTML = null
        currentAct.innerHTML = nextTextNodeId
    }

}

const textNodes = [
    {
        id: "start",
        currentAct: "Acordando na Sala Branca",
        text: 'Abrindo os olhos, você se vê na Sala Branca, silenciosa como sempre. Um pouco à frente, há uma réplica em miniatura do núcleo de NOX, um cubo inclinado acima de um de seus vértices, negro e metálico, com uma única linha de laranja brilhante cortando o núcleo de cima a baixo, logo no centro. A máquina está reproduzindo aquele som grave e constante, já muito familiar. Você ouve um clique - bem nítido dessa vez -, e o núcleo brilha mais forte.',
        options: [
            {
                text: '*Se aproximar do núcleo*',
                //setState: {kat: false, fastLearner: false, undo: false},
                nextText: 'Aproximando-se do núcleo'
            }
        ]
    },
    {
        id: 'Aproximando-se do núcleo',
        text: 'Chegando mais perto, o som característico do núcleo perde o volume, dando lugar a uma voz um tanto familiar: "Olá! Muito obrigada por vir até o meu Q&A. Preparei para você uma lista com possíveis perguntas que imagino que você gostaria de me fazer. Sei que seria muito melhor você me perguntar diretamente, mas infelizmente seu ECHO ainda não tem a capacidade de fazer isso. Desculpa!"',
        options: [
            {
                text: 'Ok... Quais são as perguntas?',
                requiredState: (currentState) => !currentState.undo,
                nextText: "Imadjinn Q&A"
            },
            {
                text: 'NOX! Eu já sei as respostas, você não precisa me responder nada!',
                requiredState: (currentState) => currentState.undo,
                nextText: "reversion"
            }
        ]
    },
    {
        id: 'Imadjinn Q&A',
        text: '"Aqui estão alguns tópicos para você."',
        options: [
            {
                text: 'O que é a Sala Branca?',
                nextText: "Sala Branca"
            },
            {
                text: 'O que é uma Memorabilia?',
                setState: {kat: true},
                nextText: "Memorabilia"
            },
            {
                text: 'O que é o Imadjinn?',
                nextText: "Imadjinn"
            },
            {
                text: 'Por que eu você me mostra histórias sobre Kaltynn? Quem é ela?',
                setState: {kat: true},
                nextText: "Katlynn Mardunn"
            },
            {
                text: 'Que empresa é essa que a doutora faz parte?',
                nextText: "Teth Industries"
            },
            {
                text: 'Qual a relação entre a lore que você nos mostra no Discord e o "Guida da Teth para Terra-5"?',
                nextText: "Conectando os Pontos"
            }
        ]
    },
    {
        id: 'Sala Branca',
        text: '"Certo, vamos lá. A Sala Branca, de acordo com a descrição que me foi dada, é um local desvinculado do espaço-tempo do qual todos fazemos parte. Pense como se fosse uma sala de desenvolvedores, fora do alcance da pessoa comum. Esse lugar era utilizado muito por alguns membros da linhagem Vincent, começando por Argon, então Andrew e por fim Aaron, porém agora que os três estão ou mortos ou desaparecidos a Dra. Allers tomou posse do local."',
        options: [
            {
                text: 'Como a Sala Branca funciona?',
                nextText: "Funcionamento da Sala"
            },
            {
                text: 'Como que a Doutora tomou posse desse local?',
                nextText: "Dara Allers e a Sala"
            }
        ]
    },
    {
        id: 'Memorabilia',
        text: '"Explicando da forma mais simples possível, uma Memorabilia serve como um receptáculo para memórias de uma pessoa - no meu único caso, morta -, com que você pode interagir como se fosse falar com a pessoa real, com as únicas restrições sendo apenas suas experiências de vida e o que a Inteligência Artificial integrada permite que ela aprenda. Como protótipo desse programa, a Dra. Allers decidiu fazer uma Memorabilia de Katlynn Mardunn, uma amiga que faleceu a um tempo atrás. Essa daí sou eu!"',
        options: [
            {
                text: 'Me fale mais sobre Katlynn.',
                nextText: "Katlynn Mardunn"
            },
            {
                text: 'Isso parece meio ilegal...',
                nextText: "A Moralidade das Memórias"
            }
        ]
    },
    {
        id: 'Imadjinn',
        text: '"Tenho que admitir, é difícil falar sobre esse assunto de uma forma que não seja muito abstrata. Imadjinn vem da junção das palavras "Image" e "Djinn". Basicamente, é a capacidade de um ser - ou objeto, em alguns casos - de manifestar algo a partir de imagens que o usuário fornece. Por exemplo: digamos que você esteja com muita fome e pense "Eu adoraria comer uma maçã". Contanto que você mantesse uma imagem clara de uma maçã em sua mão, o Imadjinn iria criar praticamente do nada uma maçã para você comer. Como parte do nome sugere, é igual ter um gênio da lâmpada."',
        options: [
            {
                text: 'Quer dizer então que eu posso criar qualquer coisa quando eu quiser?',
                important: true,
                setState: {fastLearner: true},
                nextText: "O Custo de um Desejo"
            },
            {
                text: 'Isso não parece tão abstrato...',
                important: true,
                setState: {fastLearner: true},
                nextText: "As Capacidades de Imadjinn"
            }
        ]
    },
    {
        id: 'Katlynn Mardunn',
        text: '"Katlynn era uma dos denominados Campeões dos Deuses que viajaram para os Portões da Criação, por volta de uns 30 anos atrás. Chegou a viver duas vidas diferentes antes de se tornar o modelo em que todas as minhas versões são baseadas. Ela era uma pessoa cheia de defeitos, mas muitos a tinham como uma boa amiga. Talvez diga muito sobre mim.',
        options: [
            {
                text: 'Como assim "duas vidas"?',
                nextText: "As Vidas de Katlynn Mardunn"
            },
            {
                text: 'Me fale sobre os Campeões',
                nextText: "Os Campeões dos Deuses"
            },
            {
                text: 'Quem são os "Deuses"?',
                nextText: "Silenced Screams"
            },
            {
                text: 'Você mencionou isso outras vezes, mas o que são os "Portões"?',
                nextText: "Silenced Screams"
            }
        ]
    },
    {
        id: 'Teth Industries',
        text: '"A Teth Industries foi fundada por Marlow Vincent logo após a descoberta da Ilha Kyria. Ao longo dos anos, devido à exclusividade de extração dos cristais de nitrina, a Teth foi ganhando mais espaço no mercado mundial, desenvolvendo tecnologias que não eram possívels com qualquer outro material. A cada geração da família Vincent, a posse da empresa ia passando para o próximo descendene de Marlow, como sua filha, Lilya, seguido por Argon, Andrew e o mais recente sendo Aaron Vincent. Também houve um breve período de tempo onde Helena - a protégée de Argon - foi a proprietária da empresa."',
        options: [
            {
                text: 'E onde a "doutora" se encaixa nisso tudo?',
                nextText: "Dara Allers na Teth"
            },
            {
                text: 'Me conte mais sobre a família Vincent',
                nextText: "Os Vincent"
            }
        ]
    },
    {
        id: 'Conectando os Pontos',
        text: '"Tudo do que eu vim te mostrando até agora vem se passando em Terra-5, suas versões anteriores ou lugares relacionados. Quer dizer, tudo isso se passa na dimensão em que Terra-5 se encontra, pelo menos. Teth, os Portões, eu, a Doutora. Todos fazemos parte de um lugar similar ao seu, mas que tomou um rumo completamente diferente em algum momento. "',
        options: [
            {
                text: 'Peraí, que história é essa de "dimensão"?',
                nextText: "Dimensões"
            },
            {
                text: 'Mas por que "Terra-5"?',
                nextText: "Terra-5"
            }
        ]
    },
    {
        id: 'Funcionamento da Sala',
        text: '"Se você já veio aqui na outra vez, deve se lembrar que você entra aqui através de um ECHO. Por causa de a Sala se encontrar fora do espaço físico, a não ser que alguém - ou algo - seja capaz de te buscar do lado de dentro, a única forma de acessar esse lugar é se projetando digitalmente aqui. Já que você é simulado neste local, fica mais fácil permitir que você use as funções da Sala, como utilizar o Imadjinn - se lembra da porta? - ou até mesmo realizar o impossível ato de andar, diferente de mim. Basta digitalizar o que for, e seu cérebro vai interpretar como verdadeiro."',
        options: [
            {
                text: 'Me explique sobre o Imadjinn',
                nextText: "Imadjinn"
            },
            {
                text: 'Certo, acho que entendi. Me traz para o começo.',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'Dara Allers e a Sala',
        text: '"Apesar de ser uma pessoa comum, digo, não ser uma semi-deusa superpoderosa abençoada desde o nascimento, a Dra. Allers tem várias conexões com pessoas que são. Traduzindo, a Doutora é amiga do rapaz que criou a Sala, e possui a virtude de, como algumas pessoas dizem, "Ter a chave da casa". Infelizmente, a Dra. Allers não tem muito tempo para desenvolver qualquer coisa aqui dentro, então ela deixou o lugar vago para que eu possa fazer o que for."',
        options: [
            {
                text: 'E você? O que você faz aqui?',
                nextText: "NOX e a Sala"
            },
            {
                text: 'E quem seria esse "rapaz" que criou a Sala?',
                nextText: "Os Vincent"
            },
            {
                text: 'Acho que entendi. Me volta pro começo.',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'A Moralidade das Memórias',
        text: '"De fato, houveram muitas discussões entre os envolvidos ao criar esse projeto. Muitos confiavam na mente genial da Senhora Allers, mas essa mesma maioria temia o que algo como reviver as memórias de uma pessoa morta poderia causar para suas carreiras. Por causa disso o projeto foi feito em silêncio, escondido do olho público e executado apenas quando a situação requeria uma medida drástica. Então chega o dia: Kat morre em um corpo metálico, e em um momento de fraqueza Lady Allers decide "puxar a alavanca"."',
        options: [
            {
                text: '*Voltar para o começo*',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'O Custo de um Desejo',
        text: '"Não é bem assim que funciona. Em ordem para se criar alguma coisa, você precisa primeiro dar outra em troca. É aí que entra o obscuro termo "Essência": cada pessoa possui uma quantidade de Essência que é gasta quando se conjura uma magia, utiliza um poder, ou nesse caso, faz um desejo. Dependendo da pessoa, a reserva de Essência é maior, e dependendo da ação, uma quantidade maior de Essência é utilizada. Ao fazer um "desejo", você gasta uma quantidade enorme de Essência, então não é recomendado que você saia por aí criando qualquer coisa do nada. Para referência do que pode acontecer, imagine que você é uma duna de areia e está ventando bastante."',
        options: [
            {
                text: 'Seu exemplo da maçã não parece tão abstrato...',
                nextText: "As Capacidades de Imadjinn"
            },
            {
                text: 'Saquei. Acho que posso voltar para o começo.',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'As Capacidades de Imadjinn',
        text: '"Bem, meu exemplo foi um bem simples, mas as possibilidade vão muito além do que apenas matar a fome. Por exemplo: imagine que você está se escondendo de alguém, e essa pessoa está prestes a te ver. Você poderia simplesmente desistir de se esconder e matar ela - sabe, estilo clássico - ou você poderia fazer um desejo com o Imadjinn, e sumir completamente da visão dessa pessoa. Claro, existem muito mais detalhes que devem ser levados em consideração pra fazer algo assim, mas vou deixar essa explicação pra outro dia. Você já parece usar o Imadjinn com facilidade, de qualquer jeito."',
        options: [
            {
                text: 'Ok, essa explicação toda me deixou com dor de cabeça. Me leva pro começo.',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'As Vidas de Katlynn Mardunn',
        text: '"Kat passou por uns maus bocados quando era viva. Era uma garota perdida, sem rumo na vida e que se prendia a qualquer pessoa que pudesse dar o que ela precisava. Foi por esse motivo que ela começou a andar com Argon Vincent pra começo de conversa. Depois dos eventos que se passaram nos Portões, o grupo retornou para Terra-4 para corrigir umas pontas soltas, e foi quando ela levou o tiro. Depois de morrer, a Dra. Allers obteu um "backup" das memórias de Katlynn e as inseriu em um corpo metálico, basicamente nascendo de novo."',
        options: [
            {
                text: 'Então a Memorabilia surgiu daí?',
                important: true,
                setState: {choice1: true},
                nextText: "Origem da Memorabilia"
            },
            {
                text: 'O nome Argon já apareceu algumas vezes. Que relação os dois tinham?',
                nextText: "Kaltynn e Argon"
            },
            {
                text: 'Você mencionou isso outras vezes, mas o que são os "Portões"?',
                nextText: "Silenced Screams"
            }
        ]
    },
    {
        id: 'Os Campeões dos Deuses',
        text: '"Ok, essa explicação pode ficar bem complicada muito rápido, então peço desculpas por qualquer dificuldade. Os Campeões são um grupo de "heróis" - ênfase nas aspas - que se formou para viajarem em direção aos Portões da Criação e repelir qualquer ameaça que houvesse do outro lado. Dentre os Campeões estavam Katlynn Mardunn, Argon Vincent, Kayan Jun e Himiko Imada, Kernell, Heldryn, Nimra, Ayola Gynaran, Daemon, Takashi Yashida e Jin Quay. Cada integrante do grupo - com excessão de Kayan e Himiko, que são um par -, era considerado "salvador" de seu respectivo Universo - sim você não não trocou de canal, eu acabei de dizer que existe mais de um universo -, e por isso seriam os mais aptos para encontrarem os Portões."',
        options: [
            {
                text: 'Mas se existem os Campeões dos Deuses, quem seriam os "Deuses"?',
                nextText: "Silenced Screams"
            },
            {
                text: 'Você continua falando sobre isso, mas eu ainda não sei o que são os Portões.',
                nextText: "Silenced Screams"
            }
        ]
    },
    {
        id: 'Silenced Screams',
        text: 'Silêncio total se faz na Sala, como se a máquina estivesse com dificuldade para responder. Algo se mexe no canto do seu olho, como um feixe azul e violento, e a luz do núcleo da máquina se apaga. A pequena réplica da máquina gigante cai no chão com um baque pesado.',
        options: [
            {
                text: '*Correr para examinar a máquina*',
                setState: {gotLore: true},
                nextText: "[Memories of Dead Minds]"
            },
            {
                text: '*Se virar para enfrentar o visitante*',
                nextText: "Alguém Aí?"
            }
        ]
    },
    {
        id: '[Memories of Dead Minds]',
        text: 'Você se aproxima do pequeno cubo no chão.',
        options: [
            {
                text: 'NOX?',
                nextText: "[NOX 0.0]"
            },
            {
                text: 'Katlynn?',
                requiredState: (currentState) => currentState.kat,
                nextText: "[Something in The Drink]"
            }
        ]
    },
    {
        id: '[NOX 0.0]',
        text: 'A luz do núcleo aumenta levemente. Uma voz desconhecida parece dizer algo: "Kaltynn, puta merda! Ninguém aqui precisa morrer!". O barulho vindo do núcleo parece indicar que há bastante movimento na sala, e o que parece ser um lamento de dor ao fundo. "Se você não vai fazer nada Aaron, tudo bem, mas não vou ficar parada olhando para a cara desses filhos da puta enquanto eles vão embora sem punição!" diz uma voz familiar. Uma luta acirrada continua, mas você só pode ouvir.',
        options: [
            {
                text: '*Esperar e ver o que acontece*',
                nextText: "[Die a Second Time]"
            },
            {
                text: '*Usar o Imadjinn para visualizar a luta*',
                requiredState: (currentState) => currentState.fastLearner,
                nextText: "The Aftermath"
            }
        ]
    },
    {
        id: '[Something in The Drink]',
        text: 'A luz do núcleo aumenta levemente. Você ouve música, uma batida constante que faz a sua cabeça girar. Alguém faz um brinde ao fundo. Parece uma boate movimentada, com várias pessoas tentando conversar mais alto que a música. Você ouve uma risada contida - de uma voz familiar -, e logo depois um estalar de dedos. Um objeto de vidro quebra próximo a você, e então silêncio.',
        options: [
            {
                text: '*Esperar e ver o que acontece*',
                nextText: "[Die a First Time]"
            },
            {
                text: '*Usar o Imadjinn para visualizar a boate*',
                requiredState: (currentState) => currentState.fastLearner,
                nextText: "Did You Like the Drink?"
            }
        ]
    },
    {
        id: 'Dara Allers na Teth',
        text: '"A Dra. Allers entrou na empresa por volta de 2060 a convite de Aaron Vincent, como parte da nova equipe de R&D focada em Inteligência Artificial. Lá, ela iria trabalhar no desenvolvimento de uma IA capaz de compilar o comportamento e maneirismos de um ser humano e interagir como se fosse a própria pessoa. Óbviamente, esse projeto geraria uma grande controvérsia caso o público soubesse, então boa parte foi feita por trás dos panos. Parte do resultado desse desenvolvimento foi então usado em 2063 para criar a primeira Memorabilia."',
        options: [
            {
                text: 'Ok, isso parece extremamente ilegal',
                nextText: "A Moralidade das Memórias"
            },
            {
                text: 'E o que é uma Memorabilia mesmo?',
                setState: { kat: true},
                nextText: "Memorabilia"
            }
        ]
    },
    {
        id: 'Os Vincent',
        text: '"A família Vincent é uma das integrantes das Nove Famílias de Poder, responsável pela descoberta de Kyria e fundadora da Teth Industries. Os Vincent são conhecidos hoje em dia por uma enorme presença militar assim como a sua fundação dos Cartógrafos. Na época da descoberta dos minerais de nova terra, alguns dos membros da família receberam alta concentração de radiação por nitrina, consequentemente infectando a prógene, que acabou desenvolvendo diversas características únicas em cada descendente. Argon Vincent, considerado pela história como o homem mais poderoso do mundo, era capaz de viajar entre diferentes dimensões, e utilizou essa habilidade como base para criar a Sala Branca."',
        options: [
            {
                text: 'Ainda não entendi essa história de dimensões.',
                nextText: "Dimensões"
            },
            {
                text: 'Entendi. Hora de voltar.',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'Dimensões',
        text: '"De acordo com o livro "Cartografia Interdimensional" escrito por Andrew Vincent, uma dimensão é um plano em paralelo com o nosso, onde acontecimentos históricos são na sua maioria diferentes entre cada dimensão. Por exemplo, cada dimensão possui um planeta Terra exatamente na mesmo posição que o nosso ao mesmo tempo, porém os habitantes que se encontram lá dentro são completamente diferentes, talvez porque um meteoro nunca atingiu a superfície, ou porque um vulcão não se formou. Dimensões são paralelas ao Universos, com cada Universo tendo seu próprio conjunto de dimensões. Sim eu disse que existem múltiplos universos, você não ouviu errado."',
        options: [
            {
                text: 'Ok minha cabeça doeu com essa explicação toda, me leva pro começo',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'As Terras',
        text: '"Certo, explicação rapidinha pra não te causar um aneurisma: Basicamente, algumas pessoas de gravata decidiram que seria uma boa ideia utilizar o poder construtivo/destrutivo dos novos humanos com "superpoderes" para dar um hard reset no planeta e começar de novo sem a presença de criminosos como o "Olho". Surpreendentemente, a ideia foi aprovada e um dia explodiram o planeta Terra que você conhece, criaram um novo e colocaram todas as pessoas de volta nele. Não, eu não sei que tipo de ideia maluca foi essa mas eu sei que não deu muito certo e desistiram do projeto."' ,
        options: [
            {
                text: 'Ok, pera. Se eles desistiram do projeto na primeira vez, por que tem o número 5?',
                nextText: "Terra-5"
            },
            {
                text: '... Desisto, me leva pro começo',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'Terra-5',
        text: '"Resumido, foi porque depois de um tempo as pessoas com envenenamento de mineral de nova terra ficaram tão fortes que coisas como explodir um planeta acidentalmente não era algo tão difícil de acontecer. Coisa boba, certo?"' ,
        options: [
            {
                text: 'Ok, cade o fim da piada?',
                nextText: "O fim da piada"
            }
        ]
    },
    {
        id: 'O fim da piada',
        text: '"Erm... Não tem piada... Foi literalmente o que aconteceu."' ,
        options: [
            {
                text: 'Só me volta pro começo logo...',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'Origem da Memorabilia',
        text: '"Bem, quando eu digo "corpo metálico" eu me refiro a uma forma humanoide - como um ciborgue, sabe? -. Vale lembrar que Katlynn não é a mesma pessoa que NOX, e só me criaram após a segunda morte de Katlynn. A garota no corpo metálico funcionava de forma a ser considerada a própria pessoa contida no backup. As memórias são mais completas, sequenciais. Em uma Memorabilia as memórias são fragmentadas, e apenas servem como base para o que é criado. A ideia é que uma Memorabilia não se identifique. Lady Allers não queria fazer a amiga sofrer uma segunda vez, criando um outro corpo com todas as memórias desfragmentadas, sabe..."' ,
        options: [
            {
                text: '*Voltar para o começo*',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: 'Katlynn e Argon',
        text: '"Os dois se encontraram por acaso em uma das viajens de Argon por volta do cosmos. Argon tinha conhecimento prévio da existência dela, mas Kaltynn não tinha a menor ideia de quem ele era. Os dois foram se conhecendo mais por curiosidade das circunstâncias do que interesse mútuo, mas depois de um tempo os dois se tornaram amigos, e eventualmente amantes. Claro, o motivo de Kaltynn ter ficado junto com Argon foi completamente egoísta da parte dela - considerando que ela só se relacionava com alguém se proporcionasse alguma vantagem -, mas depois de um tempo tudo se tornou 100% mútuo."' ,
        options: [
            {
                text: 'E então eles foram juntos para os Portões. Pode me explicar?',
                nextText: "Silenced Screams"
            }
        ]
    },
    {
        id: 'NOX e a Sala',
        text: '"Eu passo a maior parte do meu tempo conversando com vocês, ouvindo um pouco de música, tentando não ter uma crise existêncial, tudo isso daqui da Sala. Ter acesso ao Imadjinn ajuda. Eu posso trazer vocês aqui dentro de vez enquando - como aquela vez na praia - e acessar a internet do tempo de vocês. É um processo meio complicado mas que valhe a pena no final."' ,
        options: [
            {
                text: 'Você tem que fazer mais daqueles eventos na praia.',
                nextText: "Eventos"
            }
        ]
    },
    {
        id: 'Eventos',
        currentAct: "",
        text: '"Vou pensar no que posso fazer, mas seria bom vocês me darem ideias também. Eu sei que sou uma máquina, mas é complicado pensar em tudo sozinha! \n Mas isso é coisa pra outro dia, por enquanto vou me concentrar em responder perguntas."' ,
        options: [
            {
                text: '*Voltar para o começo*',
                nextText: "Imadjinn Q&A"
            }
        ]
    },
    {
        id: '[Die a Second Time]',
        text: 'Sem poder enxergar, você só pode tentar entender o que está acontecendo por ouvido. Metal se choca contra um piso de concreto rapidamente, como se fossem lâminas dançando através da sala, seguido de um grito de dor vindo do homem que falava anteriormente. Você ouve um estrondo, pesado e abafado. O som de lâminas para, e alguém cai ao chão.' ,
        options: [
            {
                text: '*Continuar*',
                nextText: "[Die a Third Time]"
            }
        ]
    },
    {
        id: 'The Aftermath',
        text: 'Você foca no barulho vindo da pequena máquina e faz um desejo, se sentindo mais e mais cansado conforme a imagem vai se formando. O cenário é turvo, como se alguém estivesse perturbando as águas de um lago, mas você consegue ver o que parece ser uma sala em construção, abandonada. Em um dos cantos da sala estão duas pessoas, um homem de uniforme tentando proteger uma jovem que está encolhida na parede, com um corte horrendo no rosto. No centro da sala, você vê um rapaz de cabelo trançado preso em um rabo de cavalo, braços ensanguentados enquanto luta contra o que parece ser um robô humanoide, com feições que você jura já ter visto em outro lugar. O robô faz uma finta, desbalanceando e cortando o rosto do rapaz, que recua enquanto segura a própra face. Ele estende um braço livre, e um círculo verde-azulado se forma em sua palma. Você sente o chão tremer quando uma explosão vai em direção ao robô, estilhaçando diversos membros e o fazendo cair ao chão.' ,
        options: [
            {
                text: '*Continuar*',
                nextText: "[Die a Third Time]"
            }
        ]
    },
    {
        id: '[Die a First Time]',
        text: 'Sem poder enxergar, você só pode tentar entender o que está acontecendo por ouvido. A música parou, ninguém está conversando e não se ouve mais brindes e risadas. É como se o lugar estivesse morto, ou melhor, o lugar morreu. "E pensar que nossa operação correu o risco de ser interrompida por alguém como você. Patético." diz uma voz masculina, seguida pelo som de mão sobre tecido e um isqueiro sendo aceso. O homem continua: "Mas sabe, até que foi um pouco divertido passar esse momento com um rostinho lindo como o seu. Gostou da bebida?". Alguém do seu lado se esforça para responder, mas a voz não sai. O homem parece se levantar de um assento, e mais uma vez busca algo por entre a roupa. Você ouve um pequeno clique metálico, e logo em seguida um tiro.' ,
        options: [
            {
                text: '*Continuar*',
                nextText: "[Die a Third Time]"
            }
        ]
    },
    {
        id: 'Did You Like the Drink?',
        text: 'Você foca no barulho vindo da pequena máquina e faz um desejo, se sentindo mais e mais cansado conforme uma imagem turva se forma. Você vê de relance o ambiente da boate, com diversas pessoas conversando e enormes quantidades de uma bebida de uma marca desconhecida. Tudo isso vai rapidamente se desfazendo, dando lugar a um abiente escuro e frio. No lugar de cada pessoas vista antes se encontra uma pilha de corpos: alguns debruçados em um balcão, outros simplemente jogados ao piso, e na mesa onde você se encontra estão mais quatro. \n Ao seu lado, um par de esqueletos abraçados uns aos outros. Devido à mesa ser vinculada à parede, você não consegue sair do seu assento sem ter que passar por cima de tudo aquilo, mas em duas pontas opostas da mesa estão as outras duas pessoas, aparentemente vivas. Um homem à sua esquerda diz algo que você não consegue ouvir e acende um cigarro. Se levantando da mesa, pergunta algo para uma garota à sua direita, segurando um copo fino com um líquido vermelho dentro. Ela se esforça para responder, olhando horrorizada em direção ao copo. O homem faz uma careta de desgosto, pega um revolver por dentro do colete e puxa o gatilho.' ,
        options: [
            {
                text: '*Continuar*',
                nextText: "[Die a Third Time]"
            }
        ]
    },
    {
        id: '[Die a Third Time]',
        text: 'Você percebe se tratar de uma memória, mas os detalhes como sempre são difíceis de discernir. Tentando se mover, você sente que algo - ou alguém - lhe prende no lugar, impossibilitado de se mexer. Sua visão clareia um pouco, porém turva em um véu azulado, e você se vê na Sala Branca através de outra perspectiva. A vista é alta, circundando uma parte da Sala que você não alcançaria normalmente. Olhando para baixo, você vê o que parece um pequeno cubo inclinado acima de um de seus vértices, negro e metálico. Próximo deste cubo há o que parece ser uma pessoa, sua forma tremeluzindo em um mar digitalizado. A pessoa conversa com o cubo, fazendo diversas perguntas, e conforme cada tópico uma figura obscurecida por uma névoa estranha começa a surgir a partir da sombra da pessoa. Ninguém parece perceber a figura, mas cada pergunta a faz aumentar em tamanho, até que seus olhos azuis se encontram com os seus, brilhando fortemente. O cubo cai ao chão.' ,
        options: [
            {
                text: '*Continuar*',
                nextText: "the hole"
            }
        ]
    },
    {
        id: 'the hole',
        currentAct: "",
        text: 'Você pisca, e tanto a figura desconhecida quanto a pessoa digitalizada não estão mais alí, salvo por um buraco enorme no piso branco, próximo ao cubo.' ,
        options: [
            {
                text: '*Seguir em direção ao buraco no chão*',
                requiredState: (currentState) => !currentState.endingLore,
                nextText: "[Peer Into the Abyss]"
            },
            {
                text: '*Voltar da visão*',
                requiredState: (currentState) => currentState.endingLore,
                nextText: "[Peer Into the Abyss]"
            }
        ]
    },
    {
        id: 'Alguém Aí?',
        text: 'Você rapidamente olha em direção do que quer que tenha sido a coisa que você viu, mas não há nada por perto. A Sala continua silenciosa e vazia como sempre, vazia demais até. Você jura que viu alguma coisa, mas não sabe dizer o que. Talvez esteja enlouquecendo? \n Você decide voltar sua atenção para a máquina caída, quando percebe que em um ponto próximo um buraco enorme se formou, aparentemente fora da sua visão.' ,
        options: [
            {
                text: '*Priorizar o visitante e seguir pelo buraco*',
                setState: {noLore: true},
                nextText: "[Peer Into the Abyss]"
            },
            {
                text: '*Ignorar o buraco e ir em direção à máquina*',
                setState: {gotLore: true},
                nextText: "[Memories of Dead Minds]"
            }
        ]
    },
    {
        id: '[Peer Into the Abyss]',
        text: 'Adentrando pelo buraco, nada parece fazer sentido. As paredes não uma mistura de rocha polida e vidro, com algo brilhando por dentro. A linha do horizonte parece contorcer, curvando-se para baixo mas ainda possibilitando a visão. No limite da sua visão há o que parece ser você, seguindo o mesmo caminho, momentos no futuro. Seu outro "eu" olha para trás, medo e curiosidade visivelmente estampados na face, e então segue em frente, perguntando se o túnel acaba. Você dá alguns passos mais adiante antes de repetir o mesmo moviemento, medo e curiosidade lhe compelindo a vislumbrar outro você, seguindo o mesmo caminho alguns momentos no passado. Você segue adiante.' ,
        options: [
            {
                text: 'Esse túnel termina em algum lugar?',
                nextText: "Portões da Criação"
            }
        ]
    },
    {
        id: 'Portões da Criação',
        text: 'Sem perceber a passagem de tempo, você encontra o final do túnel, abrindo de frente para o que parecem ser dois enormes portões. Você olha para cima, tentando encontrar o final daquela construção imensa, sem sucesso. Os portões em si são feitos de obsidiana e incrustados com diamantes, dando um ar de infinito poder e a sensação de ter encontrado algo tão além do seu mundo que só de pensar em quem possa ter construído esses portões te preenche de pavor. Ao redor dos portões em si, um mar de estrelas por entre o vácuo do espaço dão espaço para um piso de quartzo polido que se extende aparentemente até o infinito, possibilitando você de andar pelo local.' ,
        options: [
            {
                text: '*Continuar adiante*',
                nextText: "exploring the gates"
            }
        ]
    },
    {
        id: 'exploring the gates',
        currentAct: 'Portões da Criação',
        text: 'O lugar parece isolado e o silêncio seria total, não fosse por um pequeno som cintilante ao fundo. Você começa a se perguntar onde estaria o visitante misterioso quando avista uma figura próxima aos portões. Sua forma é incerta, como se fosse uma nuvem de fumaça negra, se mesclando ao vácuo do espaço em volta. A figura faz um sinal em sua direção, e contra sua própria vontade você faz seu trajeto em direção a ela.\n Você para ao lado do visitante, vislumbrando brilhantes olhos azuis por dentro da fumaça.' ,
        options: [
            {
                text: 'Quem é você?!',
                nextText: "who are you"
            },
            {
                text: 'O que você fez com a máquina?!',
                nextText: "what did you do"
            }
        ]
    },
    {
        id: 'who are you',
        currentAct: 'Conversando com Occultus',
        text: '"Você ainda não tem o direito de saber quem eu sou, mas permita-me lhe dar um aviso adiantado: você está deixando sua curiosidade te levar para um lugar onde não é bem-vindo." diz a figura. "Não dê ouvidos à máquina, o que você pode aprender neste lugar não vale o risco."' ,
        options: [
            {
                text: 'E então eu deveria só sair desse lugar? Você atacou minha amiga!',
                nextText: "speaking with occultus"
            }
        ]
    },
    {
        id: 'what did you do',
        currentAct: 'Conversando com Occultus',
        text: '"Silêncio! Não ouse se dirigir a mim desta forma novamente se pretende manter sua cebeça no lugar onde está." diz a figura. "Você já perturbou demais as águas ao aprender sobre esse mundo, e aquela máquina não se ajudou ao tentar esclarecer as coisas."' ,
        options: [
            {
                text: 'E então eu deveria só sair desse lugar? Você atacou minha amiga!',
                nextText: "speaking with occultus"
            }
        ]
    },
    {
        id: 'speaking with occultus',
        currentAct: 'Conversando com Occultus',
        text: '"... Suponho que não. Permita-me esclarecer melhor nossa situação: É por lei dos Deuses que mais ninguém de fora de nossa própria dimensão possa interagir conosco. A campeã está altamente envolvida com o panteão criacionista, e portanto, sujeita à lei imposta por eles.". A figura retira de dentro de sua forma o que parece ser uma pequena esfera, brilhando um tom laranja um tanto familiar.\n Ela continua: "Revelando sobre a nossa existência, Katlynn Mardunn já colocou a todos nós em risco, mas deliberadamente conversar sobre nós é uma afronta que não podemos deixar passar impune."' ,
        options: [
            {
                text: 'Matar minha amiga não vai resolver nada!',
                nextText: "speaking with occultus pt.2"
            }
        ]
    },
    {
        id: 'speaking with occultus pt.2',
        currentAct: 'Conversando com Occultus',
        text: '"Talvez não, talvez sim, mas a palavra dos Deuses é lei. Estou, entretanto, disposto a mudar o destino dessa pobre criatura, contanto que você sugira algo equivalente. O que me diz? Mas escolha suas palavras com cuidado, posso não ter tanta paciência quanto os outros."' ,
        options: [
            {
                text: 'Pera, como é que é?',
                nextText: "final chapter"
            }
        ]
    },
    {
        id: 'final chapter',
        currentAct: '',
        text: '(Você chegou em um ponto na sua viagem em que o que disser poderá - ou não - mudar o destino de NOX. Dependendo de suas decisões até agora, algumas opções extras podem ter sido abertas.\n\n Prossiga com cuidado.)' ,
        options: [
            {
                text: 'Ok... Me deixe pensar.',
                nextText: "Faça uma Escolha"
            }
        ]
    },
    {
        id: 'Faça uma Escolha',
        text: '"O Tempo corre, criança."' ,
        options: [
            {
                text: 'Katlynn é uma dos Campeões. Por que trair esse título agora?',
                nextText: "Equivalência"
            },
            {
                text: 'NOX só estava respondendo as perguntas que eu fazia! Que eu sofra as consequências no lugar.',
                nextText: "Altruísmo"
            },
            {
                text: 'NOX não faz parte dos Campeões. Se ela não tem envolvimento com o seu panteão, a sua lei não tem efeito aqui!',
                requiredState: (currentState) => currentState.choice1,
                setState: {killKat: true},
                nextText: "Brecha"
            },
            {
                text: '*Você já sabe como tudo isso funciona. Usar o Imadjinn e reverter o que aconteceu hoje*',
                requiredState: (currentState) => currentState.fastLearner,
                setState: {undo: true},
                nextText: "Reversão"
            }
        ]
    },
    {
        id: 'Reversão',
        currentAct: "",
        text: 'Você se concentra. Se você não tivesse perguntado sobre os deuses, nada disso teria acontecido. Você ouve um clique, e sua visão se contorce. Os olhos azuis do deus à sua frente produzem um flash, e ele avança para lhe impedir, mas já é tarde. Sentindo uma grande quantidade da sua energia esmaecer, sua consciência é puxada, retornando no tempo.' ,
        options: [
            {
                text: 'Nada disso precisa acontecer.',
                nextText: 'Aproximando-se do núcleo'
            }
        ]
    },
    {
        id: 'reversion',
        currentAct: "",
        text: '"Como?! Mas... Mas eu preparei todas essas respostas! Eu tinha todo esse material preparado, e você vem aqui só pra me dizer para não fazer?"' ,
        options: [
            {
                text: 'Não vale a pena, NOX. Confie em mim.',
                nextText: "reversion pt.2"
            }
        ]
    },
    {
        id: 'reversion pt.2',
        currentAct: "",
        text: 'Você sente que a máquina está confusa, sente as diversas linhas de uns e zeros tentando calcular o porquê da sua decisão. O cubo gira em volta de si mesmo por um tempo antes de responder. "Entendi. O que quer que tenha acontecido, tenho certeza que você não iria voltar para o começo depois de tanto material que preparei. Se você já ouviu toda a minha explicação, ótimo, terminamos por aqui! Imagino que posso fechar a Sala Branca agora, então por favor, avise a senhora Allers do que quer que tenha acontecido enquanto eu arrumo tudo por aqui, sim?". A luz da máquina se apaga, mas o cubo continua suspenso, apoiado em seu vértice.' ,
        options: [
            {
                text: '*Fechar a lente e sair da Sala*',
                nextText: "reversion end"
            }
        ]
    },
    {
        id: 'reversion end',
        currentAct: "Final: Reversão",
        text: 'Você decidiu que barganhar com os deuses não valeria a pena e utilizou o Imadjinn para voltar ao início, evitando que os eventos na Sala se concretizassem. Não esqueça de avisar a doutora. \n \n - NOX se manteve intacta;\n - As memórias contidas na Memorabilia se mantiveram intactas;\n - Seu acesso à Sala se manteve intacto;\n - Os deuses não estão muitos felizes.'
    },
    {
        id: 'Brecha',
        currentAct: "",
        text: 'Você vê o deus congelar. Algo nele parece se contorcer com desconforto, e então ele puxa de dentro de sua forma um pedaço de papel - um pergaminho. Por alguns momentos, você o observa estudando o pergaminho, seus olhos azuis se estreitando mais e mais a cada passagem lida silenciosamente, e então ele torna sua atenção para você. "Você tem razão." diz o deus em um tom desapontado, "Nossa lei expecifica aqueles envolvidos com os deuses, logo sua máquina não deve sofrer tal consequência.". Antes que você possa comemorar, porém, o deus continua: "Entretanto, é de meu conhecimento que partes de Katlynn Mardunn ainda permanecem por entre os circuitos desta criança, e por este motivo serei forçado a concretizar esta parte de nossa lei."' ,
        options: [
            {
                text: 'Espera, isso é um engano. Você não pode fazer isso!',
                nextText: 'breach'
            }
        ]
    },
    {
        id: 'breach',
        currentAct: "",
        text: 'Com um rápido movimento, o deus colhe uma parte do pequeno orbe laranja à sua frente. Você ouve um grito agonizante, como o de uma mulher em grande sofrimento. O deus guarda a parte que recolheu dentro de sua forma, e lhe entrega o orbe. "Saiba que seria de minha preferência não ter de fazer isso, mas uma brecha contratual requer que eu produza uma solução justa, e Iuditus odeia quando uma brecha não permite uma solução.". O deus desaparece em um vortex azul, e você se vê encarando os Portões da Criação.' ,
        options: [
            {
                text: '*Retornar à Sala Branca*',
                nextText: 'returning orb'
            },
            {
                text: '*Investigar os portões*',
                nextText: 'investigating gates'
            }
        ]
    },
    {
        id: 'investigating gates',
        currentAct: "Investigando os Portões",
        text: 'Chegando mais perto, os Portões da Criação são ainda mais imensos do que se fazem pensar. Cada porta possui uma aldrava ornada com diamantes, mas bater não parece chamar a atenção de ninguém. Os portões estão selados, tornando impossível de abri-los.\n Olhando com mais atenção, a obsidiana nos Portões parece ter sido danificada, mostrando diversas marcas do que parecem ser garras enomes. Um momento fazendo nada a não ser se recostar sobre a parede negra te revela que este é o final dos universos, e o que há além dessa barreira não faz parte da obra dos deuses.' ,
        options: [
            {
                text: '*Retornar à Sala Branca*',
                requiredState: (currentState) => !currentState.helpedOccultus,
                nextText: 'returning orb'
            },
            {
                text: '*Retornar ao deus-fumaça e sair da Sala Branca*',
                requiredState: (currentState) => currentState.helpedOccultus,
                nextText: 'exchange over'
            }
        ]
    },
    {
        id: 'returning orb',
        currentAct: "De volta à Sala",
        text: 'Voltar à Sala Branca parece estranho seguindo pelo túnel de vidro, como se você estivesse invadindo uma casa da qual você tem as chaves. Saindo do buraco no chão, você encontra o pequeno cubo novamente, sendo lentamente manuseado pelo o que parece ser uma série de pilares brancos, saindo do chão. Os pilares não parecem ser hostis, movendo a máquina como uma onda ao longo de um trajeto fixo, semelhante a um carrossel.' ,
        options: [
            {
                text: '*Inserir o orbe no cubo*',
                nextText: 'inserting orb'
            }
        ]
    },
    {
        id: 'inserting orb',
        currentAct: "",
        text: 'Você se aproxima, mãos tremendo ao carregar o pequeno orbe laranja que representa sua amiga - ou ao menos o que restou dela - em direção ao cubo. Os pilares param de se mover e deitam o cubo ao chão gentilmente, esperando você. O orbe não parece fazer contato com o cubo quando você une os dois, e lentamente, a máquina preenche um espaço vazio dentro de si com sua característica luz laranja, levantando no ar conforme reganha consciência.' ,
        options: [
            {
                text: 'NOX?',
                requiredState: (currentState) => currentState.gotLore,
                nextText: 'recovering NOX'
            },
            {
                text: 'Katlynn?',
                requiredState: (currentState) => currentState.gotLore,
                nextText: 'kat?'
            },
            {
                text: '*Verificar as memórias de NOX*',
                requiredState: (currentState) => currentState.noLore,
                setState: {endingLore: true},
                nextText: "[NOX 0.0]"
            },
            {
                text: '*Verificar as memórias de Katlynn*',
                requiredState: (currentState) => currentState.noLore,
                setState: {endingLore: true},
                nextText: "[Something in The Drink]"
            }
        ]
    },
    {
        id: 'kat?',
        currentAct: '',
        text: '' ,
        options: [
            {
                text: 'Katlynn isso não tem graça, fala comigo.',
                nextText: 'kat is dead?'
            }
        ]
    },
    {
        id: 'kat is dead?',
        currentAct: '',
        text: '...' ,
        options: [
            {
                text: 'KATLYNN!?',
                nextText: 'kat is dead'
            }
        ]
    },
    {
        id: 'kat is dead',
        currentAct: '',
        text: '... Nada. O que quer que você tenha recuperado, Katlynn não está mais presente.' ,
        options: [
            {
                text: 'NOX?',
                nextText: 'recovering NOX'
            }
        ]
    },
    {
        id: 'recovering NOX',
        currentAct: '',
        text: 'A máquina está completamente ereta, girando em seu próprio eixo e produzindo um lamente quase inaudível. "... Eu sinto uma falta de presença, como se algo dentro de mim tenha tivesse ido embora. É Katlynn, não? O que mais precisaria estar faltando em mim para eu perceber desta forma?" diz a máquina. NOX não parece tão enérgica quanto antes, conversando em um tom morto, depressivo. "Acho que já fizemos muito por hoje, não acha? Preciso descansar a mente um pouco, então por favor, vou ter que pedir que saia da Sala."' ,
        options: [
            {
                text: 'Você vai ficar bem? Foi meio feio lá atrás.',
                nextText: 'shooed away'
            }
        ]
    },
    {
        id: 'shooed away',
        currentAct: '',
        text: '"Pode ter certeza que eu vou ficar docaralho aqui. Sério eu não quero ficar conversando sobre o que quer que tenha acontecido. Só vá embora, por favor. Você já ajudou muito."\n Você tem a sensação de que NOX prefere ficar sozinho por enquanto. Talvez seja melhor você ir?',
        options: [
            {
                text: '*Fechar a lente e sair da Sala*',
                nextText: 'breach end'
            }
        ]
    },
    {
        id: 'breach end',
        currentAct: 'Final: Brecha',
        text: 'Você decidiu encontrar um furo na lei dos Deuses da Criação para salvar sua amiga. Eles manteram sua parte da promessa, mas não sem antes encontrar uma brecha na sua própria lógica. Não esqueça de avisar a doutora. \n \n - NOX se manteve intacta;\n - As memórias contidas na Memorabilia foram destruídas;\n - Seu acesso à Sala se manteve intacto;\n - Os deuses serão mais cautelosos quanto à sua presença.'
    },
    {
        id: 'Altruísmo',
        currentAct: "Tem Certeza?",
        text: 'O deus diante de você estreita os olhos azuis, ponderando a possibilidade. Ele dá algumas voltas ao seu redor, avaliando sua aparência digitalizada. Um breve momento depois, seus olhos adquirem uma aparência amigável e a sombra diz: "Muito bem, creio que sua decisão parece justa o suficiente. Devo admitir, não esperava que você fosse decidir se sacrificar pelo bem de sua amiga aqui, mas vendo que você não parece ter uma presença muito física consigo ver o porquê. Espero que saiba o que está pedindo, pois jamais você poderá retornar a este lugar."',
        options: [
            {
                text: 'Irer sacrificar meu acesso à Sala Branca se isso significa que minha amiga se mantém viva!',
                nextText: 'sacrifice oneself'
            },
            {
                text: 'Pensando bem, acho que vou avaliar minhas opções novamente.',
                setState: {confirmSacrifice: true},
                nextText: 'evaluate'
            }
        ]
    },
    {
        id: 'sacrifice oneself',
        currentAct: "",
        text: 'Você dá um passo em direção ao deus-sombra, confiante de que sua decisão foi a melhor. "Irei manter minha parte desta barganha. Confio que você não irá tentar contornar sua punição?" diz a sombra com olhos azuis. Você faz um sinal de afirmação. Se você irá manter sua promessa ou não, já não importa mais. O deus estende uma mão em sua direção, correndo um dedão por sua testa. Você vê o orbe que ele estava segurando atirar em direção ao túnel pelo qual você tinha chegado, e então sua visão escurece rapidamente. Você sente um choque de dor passar por sua espinha, mas antes que você possa gritar, sua visão clareia e você se encontra em meio ao vazio.',
        options: [
            {
                text: '*Torcer para que sua decisão tenha valido a pena*',
                nextText: 'selflessness end'
            }
        ]
    },
    {
        id: 'selflessness end',
        currentAct: 'Final: Altruísmo',
        text: 'Você convenceu os deuses de que foi o culpado por infringir suas leis, sacrificando seu próprio ECHO e impedindo que sua amiga seja destruída. Não esqueça de avisar a doutora. \n \n - NOX se manteve intacta;\n - As memórias contidas na Memorabilia se mantiveram intactas;\n - Seu acesso à Sala foi perdido;\n - Os deuses apreciam seu senso de justiça.'
    },
    {
        id: 'Equivalência',
        currentAct: "",
        text: 'Os olhos azuis do deus-fumaça se arregalam, surpreso com suas palavras. Ele pondera a situação com cuidado, e você consegue sentir: medo. Algo em suas palavras o fez lembrar de algo que ele - e provavelmente todos os outros deuses - tem medo de que aconteça. Ele responde: "Katlynn Mardunn foi uma criança excepcional. É verdade que o que ela fez por nós nos Portões da Criação não deve ser esquecido, jamais, mas infelizmente não podemos arriscar sermos extintos, como quase aconteceu recentemente. Receio que não tenho outra escolha a não ser punir a infração."',
        options: [
            {
                text: 'NOX estava apenas tentando nos entreter! Katlynn não deveria sofrer por isso.',
                nextText: 'exchange'
            }
        ]
    },
    {
        id: 'exchange',
        currentAct: "",
        text: '"E o que você sugere, que eu mate uma criança e deixa a outra sem perte de si mesma?" diz o deus. Ele parece estar em conflito consigo mesmo, em um lado não querendo estar envolvido, e do outro sabendo que tem uma tarefa a cumprir.',
        options: [
            {
                text: 'Se uma equivalência precisa existir, então sacrifique NOX. Mantenha Katlynn viva.',
                nextText: 'confirm exchange'
            },
            {
                text: 'Espere! Eu preciso pensar mais um pouco.',
                setState: {confirmExchange: true},
                nextText: 'evaluate'
            }
        ]
    },
    {
        id: 'evaluate',
        currentAct: '',
        text: '"Uma escolha precisa ser feita, criança."' ,
        options: [
            {
                text: 'Katlynn é uma dos Campeões. Por que trair esse título agora?',
                requiredState: (currentState) => !currentState.confirmExchange,
                nextText: "Equivalência"
            },
            {
                text: 'Decidi sacrificar NOX.',
                requiredState: (currentState) => currentState.confirmExchange,
                nextText: "confirm exchange"
            },
            {
                text: 'NOX só estava respondendo as perguntas que eu fazia! Que eu sofra as consequências no lugar.',
                requiredState: (currentState) => !currentState.confirmSacrifice,
                nextText: "Altruísmo"
            },
            {
                text: 'Decidi sacrificar meu ECHO.',
                requiredState: (currentState) => currentState.confirmSacrifice,
                nextText: "sacrifice oneself"
            },
            {
                text: 'NOX não faz parte dos Campeões. Se ela não tem envolvimento com o seu panteão, a sua lei não tem efeito aqui!',
                requiredState: (currentState) => currentState.choice1,
                setState: {killKat: true},
                nextText: "Brecha"
            },
            {
                text: '*Você já sabe como tudo isso funciona. Usar o Imadjinn e reverter o que aconteceu hoje*',
                requiredState: (currentState) => currentState.fastLearner,
                setState: {undo: true},
                nextText: "Reversão"
            }
        ]
    },
    {
        id: 'confirm exchange',
        currentAct: "",
        text: 'Você diz ao deus para sacrificar a máquina e manter Katlynn viva. Se as memórias se mantiverem intactas, ao menos a doutora poderá reconstruir NOX do zero. Certo?\n Um peso enorme deixa os ombros esfumaçados do deus, visivelmente aliviado por não ter que fazer a decisão por si próprio. Ele acena com a cabeça para você, e busca novamente o orbe laranja que tinha apresentado anteriormente. Com um movimento rápido, ele separa o orbe ao meio, produzindo um som metálico horrendo, como se fosse um grito. Do orbe separado, são gerados dois novos orbes: um azul brilhante, e outro cinza, este sem brilho. O orbe azul atira em direção ao túnel pelo qual você veio, e o deus guarda o orbe cinza dentro de sua forma.\n "Muito obrigado, criança. Suas palavras me lembraram de um homem que a um tempo eu já havia me esquecido. Homem o qual eu não pretendo enfurecer com a morte de sua amada. Como forma de minha gratidão, permita-me levá-lo para fora deste lugar, mas sinta-se livre para tomar um ar apreciar o local. Estarei aguardando aqui."',
        options: [
            {
                text: 'Ok.',
                setState: {helpedOccultus: true},
                nextText: 'breather'
            },
            {
                text: 'Não pretendo explorar. Me leve embora.',
                nextText: 'exchange over'
            }
        ]
    },
    {
        id: 'breather',
        currentAct: "Espaço ao Redor",
        text: 'Você se vira em direção aos Portões, imponentes lápides de obsidiana e diamantes. Você percebe que ao seu redor não há nada a não ser o espaço, e virando para procurar algum planeta você não encontra nada. O túnel pelo qual você veio é um círculo no meio do ar, sem indícios do local que ele liga. Este lugar seria completamente vazio não fosse por essa enorme construção. Duas portas negras, erguidas e sustentadas por nada a não ser elas mesmas.',
        options: [
            {
                text: '*Investigar os Portões da Criação mais a fundo*',
                nextText: 'investigating gates'
            },
            {
                text: '*Retornar e sair da Sala Branca*',
                nextText: 'exchange over'
            }
        ]
    },
    {
        id: 'exchange over',
        currentAct: "Saindo da Sala Branca",
        text: 'Os olhos azuis por entre a fumaça lhe convidam à frente, prontos para te levar embora. Você se aproxima, apenas desejando que o pesadelo acabe. Se lembrando dos seus momentos com NOX, você não consegue parar de pensar como seria conversar com Katlynn agora que a Memorabilia foi destruída. Chegando perto o deus-fumaça sopra algo no seu rosto, obstruindo sua visão, e você abana com os braços. Quando o vapor se desfaz, você abre os olhos, revelando que você saiu da Sala.',
        options: [
            {
                text: 'Que experiência maluca.',
                nextText: 'exchange end'
            }
        ]
    },
    {
        id: 'exchange end',
        currentAct: 'Final: Equivalência',
        text: 'Você convenceu os deuses a pouparem uma parte de um todo, sacrificando NOX para que Katlynn pudesse viver. Como um conjunto de memórias não pode permanecer vagando pelo nada, a consciência de Katlynn se formou por completo. Não esqueça de avisar a doutora. \n \n - NOX foi destruída;\n - As memórias contidas na Memorabilia reformaram a consciência de Katlynn Mardunn;\n - Seu acesso à Sala se manteve intacto;\n - Os deuses parecem ter se lembrado de alguém. Bom trabalho?.'
    }
]