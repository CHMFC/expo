import { View, SafeAreaView } from "react-native";
import Button from "../../components/button/Button";
// import { Icon, Text } from "react-native-elements";
// Sugestão: use componentes Expo-friendly para ícones e textos.
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function SucessoAoCadastrarProduto({ navigation }) {
  return (
    <SafeAreaView>
      <Header icon={false} title={"FIDELIZE PE"} />

      <View
        style={{
          width: "100%",
          height: "87%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          bottom: 64,
        }}
      >
        {/* <Icon name="checkmark-circle-outline" type="ionicon" color="#005098" size={96} /> */}
        {/* <Text
          style={{
            color: "#005098",
            fontSize: 24,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          Produto cadastrado com sucesso!
        </Text> */}
        <Button
          label={"Voltar ao menu"}
          onPress={() => navigation.navigate("OpcoesLoja")}
          backgroundColor={"#005098"}
          width={"90%"}
          textColor={"#FFFFFF"}
          padding={16}
          fontSize={16}
          borderRadius={32}
          fontWeight={"bold"}
        />
      </View>
      <Nav />
    </SafeAreaView>
  );
}
