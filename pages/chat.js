import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import { useState } from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router'; 
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM3NTE2OSwiZXhwIjoxOTU4OTUxMTY5fQ.OQKdJ3N4yXXbxSmLjDCVk2-4ZdNsdfvN103gf8bMYBc';
const SUPABASE_URL = 'https://xjsrkhzbgepfnjrcwjup.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();

    const {username} = roteamento.query;

    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    
    // useState para o loading
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                // console.log('Dados da consulta:', data);
                setListaDeMensagens(data);
                setLoading(false);
            });

        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);
            // Quero reusar um valor de referencia (objeto/array) 
            // Passar uma função pro setState

            // setListaDeMensagens([
            //     novaMensagem,
            //     ...listaDeMensagens
            // ])
            setListaDeMensagens((valorAtualDaLista) => {
                console.log('valorAtualDaLista:', valorAtualDaLista);
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);
 
    
    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                console.log('Criando mensagem: ', data);
                // setListaDeMensagens([
                //     data[0],
                //     ...listaDeMensagens,
                // ]);
            });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[0],
                backgroundImage: `url(https://images8.alphacoders.com/110/1103710.jpg)`,
                //https://wallpaperaccess.com/full/3053366.png
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'darken',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header user={username}/>
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                {loading ? 
                    <Box
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '80%',
                            marginBottom: '4rem',
                        }}
                    >
                        <Image 
                            styleSheet={{
                              opacity: '.5',                              
                            }}
                            src={'https://media4.giphy.com/media/dBexYr4s5qeJ2Jsdcj/giphy.gif'}
                        />
                    </Box>
                    :
                    <MessageList 
                        mensagens={listaDeMensagens}
                        setMensagens={setListaDeMensagens} 
                        user={username} 
                        supabaseClient={supabaseClient} 
                    />
                } 
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    if (mensagem.length >= 1) {
                                        handleNovaMensagem(mensagem);
                                    }
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        <Button
                        disabled={!mensagem}
                        onClick={() => {
                            if(mensagem.trim() !== '') handleNovaMensagem(mensagem)
                            else setMensagem('');
                        }}
                        iconName="paperPlane"
                        rounded="none"
                        buttonColors={{
                            contrastColor: `${appConfig.theme.colors.primary[550]}`,
                            mainColor: `${appConfig.theme.colors.neutrals[800]}`,
                            mainColorLight: `${appConfig.theme.colors.neutrals[600]}`,
                            mainColorStrong: `${appConfig.theme.colors.neutrals[900]}`
                        }}
                        styleSheet={{
                            borderRadius: '50%',
                            padding: '0 3px 0 0',
                            minWidth: '50px',
                            minHeight: '50px',
                            fontSize: '20px',
                            margin: '0 8px',
                            lineHeight: '0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        />
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                                console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Mandocord - Chat
                </Text>
                <Button
                    variant='secondary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date(mensagem.created_at).toLocaleString('pt-BR', {dateStyle: 'short',timeStyle: 'short'})}
                            </Text>
                        </Box>
                        {/* [Declarativo] */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker').toString()} */}
                        {mensagem.texto.startsWith(':sticker') 
                        ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')} 
                            height='150px'
                            width= '150px'
                            src={mensagem.texto.replace(':sticker:', '')}
                            />
                        )
                        : (
                            mensagem.texto
                        )}     
                    </Text>
                );
            })}
        </Box>
    )
}
