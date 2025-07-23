import { View, SafeAreaView, Text } from "react-native";
import Button from "../../components/button/Button";
import { Ionicons } from '@expo/vector-icons';
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

export default function CadastrarPontosSucesso({ navigation }) {
  return (
    <SafeAreaView>
      <Header icon={false} title={"FIDELIZE PE"} />

      <View
        style={{
          width: "100%",
          height: "88%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          bottom: 64,
        }}
      >
        <Ionicons name="checkmark-circle-outline" size={96} color="#005098" />
        <Text
          style={{
            color: "#005098",
            fontSize: 24,
            marginTop: 12,
          }}
        >
          Pontos cadastrados
        </Text>
        <Text
          style={{
            color: "#005098",
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          com sucesso!
        </Text>
        <Button
          backgroundColor={"#005098"}
          width={"90%"}
          textColor={"#FFFFFF"}
          padding={16}
          fontSize={16}
          borderRadius={32}
          fontWeight={"bold"}
          label={"Finalizar"}
          onPress={() => navigation.navigate("cadastrarPontosManualmente")}
        />
      </View>
      <Nav />
    </SafeAreaView>
  );
}
