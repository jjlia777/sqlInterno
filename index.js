import { View, Button, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const produtosBD = usarBD();

    const remove = async (id) => {
        try {
            await produtosBD.remove(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    const edit = (produto) => {
        setId(produto.id);
        setNome(produto.nome);
        setQuantidade(String(produto.quantidade));
    };

    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            const item = await produtosBD.create({
                nome,
                quantidade,
            });
            Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
            setId(item.idProduto);
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    async function update() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            await produtosBD.update({
                id,
                nome,
                quantidade,
            });
            Alert.alert('Produto atualizado com sucesso!');
            setId(''); // Limpar o ID após a atualização
            setNome('');
            setQuantidade('');
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listar();
    }, [pesquisa]);

    return (
        <View style={styles.container}>
            <TextInput style={styles.texto} placeholder="Nome" onChangeText={setNome} value={nome} />
            <TextInput style={styles.texto} placeholder="Quantidade" onChangeText={setQuantidade} value={quantidade} />
            <Button title={id ? "Atualizar" : "Salvar"} onPress={id ? update : create} color="#9157FF"/>
            <TextInput style={styles.texto} placeholder="Pesquisar" onChangeText={setPesquisa} />

            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto data={item} onDelete={() => remove(item.id)} onEdit={edit} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 16,
    },
});