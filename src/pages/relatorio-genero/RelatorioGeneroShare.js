import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";

import { Header } from "../../components/header/Header";
import { Nav } from "../../components/nav/Nav";

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import usePersist from "../../hooks/usePersist";
// import { Image, Avatar } from "react-native-elements";
// Sugestão: use componentes Expo-friendly para imagens e avatares.

import axios from "axios";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Data } from "../../components/datas/Data";

// import { BarChart } from "react-native-gifted-charts";

// import { captureScreen } from "react-native-view-shot";
import { StatusBar } from "react-native";
import { API_URL } from "../../const/apiUrl";
// Sugestão: use DateTimePicker do @react-native-community/datetimepicker (compatível com Expo), Victory Native ou react-native-svg-charts para gráficos, e expo-screen-capture para captura de tela.

export function RelatorioGeneroShare({ navigation, route }) {
  const { lojaId, dataComeco, dataFim, lojaNome, lojaImagem } = route.params;

  const [dataFinalVisivel, setDataFinalVisivel] = useState(false);
  const [dataInicioVisivel, setDataInicioVisivel] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [tokenCelularMasculino, setTokenCelularMasculino] = useState([]);
  const [tokenCelularFeminino, setTokenCelularFeminino] = useState([]);
  const [tokenCelularOutros, setTokenCelularOutros] = useState([]);
  const [tokenCelularNaoInformado, setTokenCelularNaoInformado] = useState([]);

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
          `${API_URL.base}/lojas/${lojaId}/clientes/genero`,
          {
            headers: { Authorization: `Bearer ${tokenStored}` },
            params: {
              dataInicio: dataComeco,
              dataFim: dataFim,
            },
          }
        )
        .then((res) => {
          setDadosClientes(res?.data);

          if (tokenCelularMasculino.length === 0) {
            res.data.clientesMasculino.forEach((item) =>
              setTokenCelularMasculino(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelularFeminino.length === 0) {
            res.data.clientesFeminino.forEach((item) =>
              setTokenCelularFeminino(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelularOutros.length === 0) {
            res.data.clientesOutros.forEach((item) =>
              setTokenCelularOutros(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          if (tokenCelularNaoInformado.length === 0) {
            res.data.clientesNaoInformado.forEach((item) =>
              setTokenCelularNaoInformado(
                (prevToken) => new Set([...prevToken, item?.tokenCelular])
              )
            );
          }

          setTimeout(() => {
            // captureScreen({
            //   format: "jpg",
            //   quality: 1,
            //   filename: "relatorio-de-genero",
            //   filenames: ["relatorio-de-genero"],
            // }).then(
            //   (uri) => {
            //     navigation.navigate("RelatorioGenero", {
            //       lojaId: lojaId,
            //       printUrl: uri,
            //       lojaNome: lojaNome,
            //       lojaImagem: lojaImagem,
            //     });
            //   },
            //   (error) => {
            //     return null;
            //   }
            // );
          }, 500);
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
    // setIsLoading(true);
  };

  const confirmarDataFinal = (date) => {
    setDataFinal(date);
    // setIsLoading(true);
    esconderDataFinal();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Header
        icon={false}
        iconNotifications={false}
        onPress={() => navigation.goBack()}
      />

      <ScrollView>
        <View
          style={{
            width: "90%",
            marginLeft: "5%",
            marginBottom: 10,
            paddingTop: 20,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: "#1F5A9E95",
            borderBottomWidth: 1,
          }}
        >
          {/* <Avatar
            rounded
            size={64}
            source={{ uri: lojaImagem }}
            containerStyle={{ backgroundColor: "gray", marginRight: 16 }}
          /> */}
          <Text
            style={{
              width: "77%",
              fontSize: 18,
              color: "black",
              fontWeight: "bold",
              flexWrap: "wrap",
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {lojaNome}
          </Text>
        </View>

        <Text
          style={{
            width: "90%",
            marginLeft: "5%",
            fontSize: 18,
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Relatório de Gênero
        </Text>

        <View
          style={{
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
            {/* <Data
              data={`${dataComeco.substring(8, 10)}/${dataComeco.substring(
                5,
                7
              )}/${dataComeco.substring(0, 4)}`}
              periodo={"início"}
              onPress={mostrarDataInicio}
            /> */}
            {/* <DateTimePickerModal
              isVisible={dataInicioVisivel}
              mode="date"
              date={dataInicio}
              onConfirm={confirmarDataInicio}
              onCancel={esconderDataInicio}
              maximumDate={dataFinal}
            /> */}

            {/* <Data
              data={`${dataFim.substring(8, 10)}/${dataFim.substring(
                5,
                7
              )}/${dataFim.substring(0, 4)}`}
              periodo={"final"}
              onPress={mostrarDataFinal}
            /> */}
            {/* <DateTimePickerModal
              isVisible={dataFinalVisivel}
              mode="date"
              date={dataFinal}
              onConfirm={confirmarDataFinal}
              onCancel={esconderDataFinal}
              minimumDate={dataInicio}
              maximumDate={new Date()}
            /> */}
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
            <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  marginBottom: 4,
                  fontWeight: "bold",
                }}
              >
                Clientes cadastrados
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  width: "75%",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {dadosClientes?.quantidadeClientesAtivos}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#1F5A9E",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
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
                Masculino
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    width: "75%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.quantidadeClientesMasculino}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: "48%",
                backgroundColor: "#f13e6a",
                paddingVertical: 16,
                paddingHorizontal: 24,
                height: 100,
                borderRadius: 16,
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
                Feminino
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    width: "75%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.quantidadeClientesFeminino}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: "48%",
                backgroundColor: "#f19b3e",
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
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
                Outros
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    width: "75%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.quantidadeClientesOutros}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: "48%",
                backgroundColor: "#5f6368",
                paddingVertical: 16,
                paddingHorizontal: 24,
                height: 100,
                borderRadius: 16,
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
                Não informado
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    width: "75%",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dadosClientes?.quantidadeClientesNaoInformado}
                </Text>
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
                {/* <BarChart
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
                          value: dadosClientes.porcentagemClientesMasculino
                            ? dadosClientes.porcentagemClientesMasculino
                            : 0,
                          color: "#1F5A9E",
                          marginBottom: 0,
                        },
                        {
                          value: dadosClientes.porcentagemClientesFeminino
                            ? dadosClientes.porcentagemClientesFeminino
                            : 0,
                          color: "#f13e6a",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes.porcentagemClientesOutros
                            ? dadosClientes.porcentagemClientesOutros
                            : 0,
                          color: "#f19b3e",
                          marginBottom: 2,
                        },
                        {
                          value: dadosClientes.porcentagemClientesNaoInformado
                            ? dadosClientes.porcentagemClientesNaoInformado
                            : 0,
                          color: "#5f6368",
                          marginBottom: 2,
                        },
                      ],
                    },
                  ]}
                /> */}
              </View>
            </View>

            <View
              style={{
                marginHorizontal: 5,
                marginVertical: 10,
                display: "flex",
              }}
            >
              {dadosClientes.porcentagemClientesMasculino ? (
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
                      Masculino
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
                    {dadosClientes.porcentagemClientesMasculino}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes.porcentagemClientesFeminino ? (
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
                      Feminino
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
                    {dadosClientes.porcentagemClientesFeminino}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes.porcentagemClientesOutros ? (
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
                      Outros
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
                    {dadosClientes.porcentagemClientesOutros}%
                  </Text>
                </View>
              ) : null}
              {dadosClientes.porcentagemClientesNaoInformado ? (
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
                    {dadosClientes.porcentagemClientesNaoInformado}%
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
