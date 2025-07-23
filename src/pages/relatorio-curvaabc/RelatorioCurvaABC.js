import React, { useState, useEffect } from "react";
import { Dimensions, StatusBar, TouchableOpacity } from "react-native";

import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";

import { SafeAreaView, View, Text, ScrollView } from "react-native";
import usePersist from "../../hooks/usePersist";
import { Image, Icon } from "react-native-elements";

import axios from "axios";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Data } from "../../components/datas/Data";

// import { BarChart } from "react-native-gifted-charts";
// Sugestão: use DateTimePicker do @react-native-community/datetimepicker (compatível com Expo) e Victory Native ou react-native-svg-charts para gráficos.

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { API_URL } from "../../const/apiUrl";

export function RelatorioCurvaABC({ navigation, route }) {
  const {
    lojaId,
    printUrl,
    lojaNome,
    lojaImagem,
    curvaA,
    curvaB,
    curvaC,
    mensagensQuantidade } =
    route.params;
  const [compartilhar, setCompartilhar] = useState(false);

  if (printUrl && compartilhar) {
    setCompartilhar(false);

    (async () => {
      try {
        // Baixa o arquivo para o cache local
        const fileUri = FileSystem.cacheDirectory + "relatorio-de-curva-abc.pdf"; // ajuste a extensão conforme o tipo do arquivo
        await FileSystem.downloadAsync(printUrl, fileUri);

        // Compartilha o arquivo baixado
        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Compartilhar via"
        });
      } catch (err) {
        // Trate o erro se necessário
      }
    })();
  }

  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [tokenCelularCurvaA, setTokenCelularCurvaA] = useState([]);
  const [tokenCelularCurvaB, setTokenCelularCurvaB] = useState([]);
  const [tokenCelularCurvaC, setTokenCelularCurvaC] = useState([]);

  const dataInicioTratada = `${dataInicio.getFullYear()}-${String(
    dataInicio.getMonth() + 1
  ).padStart(2, "0")}-${dataInicio.getDate().toString().padStart(2, "0")}`;

  const dataFinalTratada = `${dataFinal.getFullYear()}-${String(
    dataFinal.getMonth() + 1
  ).padStart(2, "0")}-${dataFinal.getDate().toString().padStart(2, "0")}`;

  const { tokenStored } = usePersist();

  useEffect(() => {
    async function pegarClientes() {
      await axios
        .get(
          `${API_URL.base}/lojas/${lojaId}/clientes/ticket`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: {
              dataInicio: dataInicioTratada,
              dataFim: dataFinalTratada,
            },
          }
        )
        .then((res) => {
          setDadosClientes(res?.data);

          if (tokenCelularCurvaA.length === 0) {
            res?.data?.curvas?.curvaA?.clientes?.forEach((item) =>
              setTokenCelularCurvaA(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelularCurvaB.length === 0) {
            res?.data?.curvas?.curvaB?.clientes?.forEach((item) =>
              setTokenCelularCurvaB(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelularCurvaC.length === 0) {
            res?.data?.curvas?.curvaC?.clientes?.forEach((item) =>
              setTokenCelularCurvaC(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }
        })
          .catch((err) => {
          return null;
        });
    }
    pegarClientes();
  }, [dataInicio, dataFinal]);

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setWidth(width);
    });
  }, []);

  const mostrarDataInicio = () => {
    setDataInicioVisivel(true);
  };

  const esconderDataInicio = () => {
    setDataInicioVisivel(false);
  };

  const mostrarDataFinal = () => {
    setDataFinalVisivel(true);
  };
  const esconderDataFinal = () => {
    setDataFinalVisivel(false);
  };

  const confirmarDataInicio = (date) => {
    setDataInicio(date);
    esconderDataInicio();
    setIsLoading(true);
  };

  const confirmarDataFinal = (date) => {
    setDataFinal(date);
    setIsLoading(true);
    esconderDataFinal();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Header icon={true} onPress={() => navigation.goBack()} />

      <ScrollView>
        <View
          style={{
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
            <Data
              data={`${dataInicio
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataInicio.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataInicio.getFullYear()}`}
              periodo={"início"}
              onPress={mostrarDataInicio}
            />
            <DateTimePickerModal
              isVisible={dataInicioVisivel}
              mode="date"
              date={dataInicio}
              onConfirm={confirmarDataInicio}
              onCancel={esconderDataInicio}
              maximumDate={dataFinal}
            />
            <Data
              data={`${dataFinal
                .getDate()
                .toString()
                .padStart(2, "0")}/${String(dataFinal.getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${dataFinal.getFullYear()}`}
              periodo={"final"}
              onPress={mostrarDataFinal}
            />
            <DateTimePickerModal
              isVisible={dataFinalVisivel}
              mode="date"
              date={dataFinal}
              onConfirm={confirmarDataFinal}
              onCancel={esconderDataFinal}
              minimumDate={dataInicio}
              maximumDate={new Date()}
            />
            <View
              style={{
                backgroundColor: "#1F5A9E",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 30,
                padding: 8,
                borderRadius: 32,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RelatorioCurvaABCShare", {
                    lojaId: lojaId,
                    dataComeco: dataInicioTratada,
                    dataFim: dataFinalTratada,
                    lojaNome: lojaNome,
                    lojaImagem: lojaImagem,
                    curvaA: curvaA,
                    curvaB: curvaB,
                    curvaC: curvaC,
                  });
                  setCompartilhar(true);
                }}
              >
                <Icon
                  name="share-social-outline"
                  color="white"
                  type="ionicon"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              backgroundColor: "#1F5A9E",
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              height: 100,
              marginTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Curva A{curvaA ? ` (acima de R$ ${curvaA})` : ""}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    width: "90%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.curvas?.curvaA?.quantidadeClientes}
                </Text>
                {mensagensQuantidade > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EnviarMensagem", {
                        lojaId: lojaId,
                        tokenCelular: tokenCelularCurvaA,
                      })
                    }
                  >
                    <Image
                      source={require("../../assets/cards/mensagem.png")}
                      style={{
                        width: 28,
                        height: 28,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              backgroundColor: "#f13e6a",
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              height: 100,
            }}
          >
            <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Curva B{curvaB ? ` (entre R$ ${curvaB} a R$ ${curvaA})` : ""}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    width: "90%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.curvas?.curvaB?.quantidadeClientes}
                </Text>
                {mensagensQuantidade > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EnviarMensagem", {
                        lojaId: lojaId,
                        tokenCelular: tokenCelularCurvaB,
                      })
                    }
                  >
                    <Image
                      source={require("../../assets/cards/mensagem.png")}
                      style={{
                        width: 28,
                        height: 28,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              backgroundColor: "#f19b3e",
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              height: 100,
            }}
          >
            <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Curva C{curvaC ? ` (até R$ ${curvaC})` : ""}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    width: "90%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.curvas?.curvaC?.quantidadeClientes}
                </Text>
                {mensagensQuantidade > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EnviarMensagem", {
                        lojaId: lojaId,
                        tokenCelular: tokenCelularCurvaC,
                      })
                    }
                  >
                    <Image
                      source={require("../../assets/cards/mensagem.png")}
                      style={{
                        width: 28,
                        height: 28,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        {
          <View
            style={{
              display: "flex",
              width: "90%",
              marginTop: 10,
              marginLeft: width <= 400 ? 18 : 40,
              marginBottom: 100,
            }}
          >
            <View
              style={{
                height: 32,
              }}
            >
              <View
                style={{
                  marginLeft: width <= 400 ? -5 : -40,
                  marginTop: width <= 400 ? -65 : -90,
                }}
              >
                <BarChart
                  horizontal
                  barWidth={24}
                  height={width <= 400 ? 354 : width * 0.9}
                  maxValue={100}
                  initialSpacing={0}
                  spacing={0}
                  labelsExtraHeight={0}
                  noOfSectionsBelowXAxis={2}
                  barBorderRadius={8}
                  hideYAxisText={true}
                  hideRules={true}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  disablePress={true}
                  stackData={[
                    {
                      stacks: [
                        {
                          value: dadosClientes?.curvas?.curvaA?.porcentagem
                            ? dadosClientes?.curvas?.curvaA?.porcentagem
                            : 0,
                          color: "#1F5A9E",
                          marginBottom: 0,
                        },
                        {
                          value: dadosClientes?.curvas?.curvaB?.porcentagem
                            ? dadosClientes?.curvas?.curvaB?.porcentagem
                            : 0,
                          color: "#f13e6a",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes?.curvas?.curvaC?.porcentagem
                            ? dadosClientes?.curvas?.curvaC?.porcentagem
                            : 0,
                          color: "#f19b3e",
                          marginBottom: 2,
                        },
                        {
                          value: Math.abs(
                            100 -
                            (dadosClientes?.curvas?.curvaA?.porcentagem
                              ? dadosClientes?.curvas?.curvaA?.porcentagem
                              : 0) -
                            (dadosClientes?.curvas?.curvaB?.porcentagem
                              ? dadosClientes?.curvas?.curvaB?.porcentagem
                              : 0) -
                            (dadosClientes?.curvas?.curvaC?.porcentagem
                              ? dadosClientes?.curvas?.curvaC?.porcentagem
                              : 0)
                          ),
                          color: "#5f6368",
                          marginBottom: 2,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: 5,
                marginVertical: 10,
                display: "flex",
              }}
            >
              {dadosClientes?.curvas?.curvaA?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#1F5A9E",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#1F5A9E",
                        fontWeight: "bold",
                      }}
                    >
                      Curva A
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#1F5A9E",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.curvas?.curvaA?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.curvas?.curvaB?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#f13e6a",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#f13e6a",
                        fontWeight: "bold",
                      }}
                    >
                      Curva B
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#f13e6a",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.curvas?.curvaB?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes?.curvas?.curvaC?.porcentagem ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#f19b3e",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#f19b3e",
                        fontWeight: "bold",
                      }}
                    >
                      Curva C
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#f19b3e",
                      fontWeight: "bold",
                    }}
                  >
                    {dadosClientes?.curvas?.curvaC?.porcentagem}%
                  </Text>
                </View>
              ) : null}
              {(Math.round(
                (100 -
                  (dadosClientes?.curvas?.curvaA?.porcentagem
                    ? dadosClientes?.curvas?.curvaA?.porcentagem
                    : 0) -
                  (dadosClientes?.curvas?.curvaB?.porcentagem
                    ? dadosClientes?.curvas?.curvaB?.porcentagem
                    : 0) -
                  (dadosClientes?.curvas?.curvaC?.porcentagem
                    ? dadosClientes?.curvas?.curvaC?.porcentagem
                    : 0) +
                  Number.EPSILON) *
                100
              ) /
                100) *
                dadosClientes?.quantidadeClientesAtivos >=
                1 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#5f6368",
                        borderRadius: 16,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 30,
                        color: "#5f6368",
                        fontWeight: "bold",
                      }}
                    >
                      Não Informado
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 30,
                      color: "#5f6368",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.round(
                      (100 -
                        (dadosClientes?.curvas?.curvaA?.porcentagem
                          ? dadosClientes?.curvas?.curvaA?.porcentagem
                          : 0) -
                        (dadosClientes?.curvas?.curvaB?.porcentagem
                          ? dadosClientes?.curvas?.curvaB?.porcentagem
                          : 0) -
                        (dadosClientes?.curvas?.curvaC?.porcentagem
                          ? dadosClientes?.curvas?.curvaC?.porcentagem
                          : 0) +
                        Number.EPSILON) *
                      100
                    ) / 100}
                    %
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        }
      </ScrollView>

      <Nav />
    </SafeAreaView>
  );
}
