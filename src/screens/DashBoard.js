import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, StyleSheet, useColorScheme, TouchableOpacity, Image } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { bleManager, requestPermissions, connectDevice,useBLEConnection } from '../config/BleConfig';


export default function TelaPainel() {

  const tema = useColorScheme();
  const modoEscuro = tema === "dark";
  const navigation = useNavigation();
  const [espacamento, setEspacamento] = useState(1)
  const [taxa, setTaxa] = useState(10)
  const [logs, setLogs] = useState([
    "13:40:41 Iniciando scan de dispositivos BLE (sistema de conexão via bluetooh)"
  ]);
  
  const cores = {
    fundo: modoEscuro ? "#1a1a1a" : "#f2f2f2",
    cartao: modoEscuro ? "#242424" : "#ffffff",
    texto: modoEscuro ? "#e6e6e6" : "#0f172a",
    primaria: modoEscuro ? "#1e6fb9" : "#4d98e2",
    destaque: modoEscuro ? "#397dbd" : "#8ec7ed",
    borda: modoEscuro ? "#333333" : "#cbd5e1",
    fundoBloco: modoEscuro ? "#242424ff" : "#f0f0f0",
    sucesso: "#22c55e",
    perigo: "#ef4444",
  };
  const estilos = obterEstilos(cores);
  const { connected, scanning, connectESP, disconnectESP } = useBLEConnection();

  const handleLimparLogs = useCallback(() => {
    setLogs([])
  }, [])

  const handleReset = useCallback(() => {
    setEspacamento(1)
  }, [])

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <View style={estilos.cabecalho}>
          <View style={estilos.cabecalhoEsquerda}>
            <FontAwesome name="microchip" size={28} color={cores.primaria} />
            <Image style={estilos.image} source={require("../assets/top.png")} />
          </View>
          <TouchableOpacity
            style={[estilos.botao, { backgroundColor: connected ? cores.perigo : cores.primaria }]}
            onPress={() => {
              if (connected) {
                disconnectESP()
              } else {
                connectESP();
              }
            }}
          >{scanning ? 
          <Text style={estilos.textoBotao}>
            Procurando...
            </Text> :<Text style={estilos.textoBotao}>
              {connected ? "Desconectar" : "Conectar"}
            </Text>}
            
          </TouchableOpacity>
        </View>
        <View style={[estilos.caixaConectado, { borderColor: connected ? cores.sucesso : cores.perigo }]}>
          <Icon name="bluetooth" size={18} color={connected ? cores.sucesso : cores.perigo} />
          <Text style={[estilos.rotulo, { color: connected? cores.sucesso : cores.perigo, fontWeight: "600", marginLeft: 6 }]}>
            {connected ? "Conectado" : "Desconectado"} - ESP32 NeuroBeep
          </Text>
        </View>
        <Cartao titulo="Comandos do Sistema" cores={cores}>
          <View style={estilos.comandosGrid}>
            <TouchableOpacity style={estilos.botaoComandoPrimario}>
              <Icon name="play" color="#fff" size={18} />
              <Text style={[estilos.textoBotao, { marginLeft: 6 }]}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botaoComandoSecundario}>
              <Icon name="restart" color={cores.texto} size={18} />
              <Text style={[estilos.textoBotao, { color: cores.texto, marginLeft: 10, opacity: 0.9 }]}>Reset Kalman</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botaoComandoSecundario}>
              <Icon name="tune" color={cores.texto} size={18} />
              <Text style={[estilos.textoBotao, { color: cores.texto, marginLeft: 10, opacity: 0.9 }]}>Calibrar IMU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botaoComandoSecundario}>
              <Icon name="test-tube" color={cores.texto} size={18} />
              <Text style={[estilos.textoBotao, { color: cores.texto, marginLeft: 10, opacity: 0.9 }]}>Testar</Text>
            </TouchableOpacity>
          </View>
        </Cartao>
        <Cartao titulo="Marcadores" cores={cores} badge={`${espacamento.toFixed(2)} m`}>
          <View style={estilos.linhaEntre}>
            <View>
              <Text style={estilos.rotuloPequeno}>Contador</Text>
              <Text style={estilos.valor}>0</Text>
            </View>
            <View>
              <Text style={estilos.rotuloPequeno}>Distância</Text>
              <Text style={estilos.valor}>0.00m</Text>
            </View>
          </View>
          <Text style={estilos.rotulo}>Espaçamento: {espacamento.toFixed(2)} m</Text>
          <Slider
            minimumValue={0}
            maximumValue={2}
            value={espacamento}
            onValueChange={(novoValor) => setEspacamento(novoValor)}
            minimumTrackTintColor={cores.primaria}
            thumbTintColor={cores.primaria}
            style={estilos.slider}
          />
          <TouchableOpacity style={[estilos.botaoResetar, { borderColor: cores.primaria }]} onPress={handleReset}>
            <Icon name="restart" color={cores.primaria} size={18} />
            <Text style={[estilos.textoBotao, { color: cores.primaria, marginLeft: 6 }]}>Resetar Contador</Text>
          </TouchableOpacity>
        </Cartao>
        <Cartao
          titulo="Telemetria"
          icone="chart-line"
          cores={cores}
          badge={`${taxa.toFixed(0)} Hz`}
        >
          <Text style={estilos.rotulo}>Taxa de Atualização: {taxa.toFixed(0)} Hz</Text>
          <Slider
            minimumValue={1}
            maximumValue={20}
            value={taxa}
            onValueChange={(novoValor) => setTaxa(novoValor)}
            minimumTrackTintColor={cores.primaria}
            thumbTintColor={cores.primaria}
            style={estilos.slider}
          />
          <View style={estilos.telemetriaGrid}>
            <BlocoTelemetria
              icone="sync"
              titulo="Encoders"
              cores={cores}
              dados={[
                { rotulo: "Esq", valor: "0" },
                { rotulo: "Dir", valor: "0" },
              ]}
            />
            <BlocoTelemetria
              icone="speedometer"
              titulo="Velocidades"
              cores={cores}
              dados={[
                { rotulo: "Esq", valor: "0.00" },
                { rotulo: "Dir", valor: "0.00" },
              ]}
            />
            <BlocoTelemetria
              icone="send"
              titulo="Odometria"
              cores={cores}
              dados={[
                { rotulo: "X", valor: "0.0m" },
                { rotulo: "Y", valor: "0.0m" },
                { rotulo: "θ", valor: "0.00°" },
              ]}
            />
            <BlocoTelemetria
              icone="crosshairs-gps"
              titulo="GPS"
              cores={cores}
              dados={[
                { rotulo: "Lat", valor: "0.00" },
                { rotulo: "Lng", valor: "0.00" },
                { rotulo: "Vel", valor: "0.00" },
              ]}
            />
          </View>
          <View style={estilos.linhaPosicao}>
            <Text style={estilos.telemetriaRotuloDado}>Posição da Linha:</Text>
            <Text style={estilos.telemetriaValorDado}>36</Text>
          </View>
        </Cartao>

        <Cartao titulo="Logs" cores={cores}>
          <Text style={{ color: cores.texto, opacity: 0.7, lineHeight: 20 }}>
            {logs.length > 0 ? logs.join("\n") : "Nenhum Log para exibir"}
          </Text>
          <TouchableOpacity style={[estilos.botaoLimpar, { backgroundColor: cores.perigo }]} onPress={handleLimparLogs}>
            <Icon name="delete-outline" color="#fff" size={18} />
            <Text style={estilos.textoBotao}>Limpar</Text>
          </TouchableOpacity>
        </Cartao>

      </ScrollView>
      <TouchableOpacity
        style={estilos.botaoFlutuante}
        onPress={() => navigation.navigate("ControlScreen")}
      >
        <Icon name="gamepad-variant" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}



function Cartao({ titulo, children, cores, icone, badge }) {
  const estilos = estilosCartao(cores);
  return (
    <View style={[estilos.cartao, { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 }]}>
      <View style={estilos.tituloContainer}>
        <View style={estilos.tituloEsquerda}>
          {icone && <Icon name={icone} size={18} color={cores.texto} style={{ marginRight: 8, opacity: 0.8 }} />}
          <Text style={estilos.titulo}>{titulo}</Text>
        </View>
        {badge && (
          <View style={estilos.badge}>
            <Text style={estilos.badgeTexto}>{badge}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}
function BlocoTelemetria({ icone, titulo, dados, cores }) {
  const estilos = obterEstilos(cores);
  return (
    <View style={estilos.telemetriaItem}>
      <View style={estilos.telemetriaItemTituloRow}>
        <Icon name={icone} size={14} color={cores.texto} />
        <Text style={estilos.telemetriaItemTitulo}>{titulo}</Text>
      </View>
      {dados.map((item, index) => (
        <View style={estilos.telemetriaLinhaDado} key={index}>
          <Text style={estilos.telemetriaRotuloDado}>{item.rotulo}:</Text>
          <Text style={estilos.telemetriaValorDado}>{item.valor}</Text>
        </View>
      ))}
    </View>
  );
}

function obterEstilos(cores) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    image: {
      width: 150,
      height: 50,
      resizeMode: "contain",
      alignSelf: "center",
    },

    botaoFlutuante: {
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 40,
      backgroundColor: cores.primaria,
      borderRadius: 30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    cabecalho: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    cabecalhoEsquerda: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    titulo: {
      fontSize: 24,
      fontWeight: "700",
      color: cores.texto,
    },
    rotulo: {
      color: cores.texto,
      fontSize: 14,
      marginVertical: 6,
    },
    rotuloPequeno: {
      color: cores.texto,
      fontSize: 13,
      opacity: 0.7,
      marginTop: 8,
    },

    valor: {
      color: cores.texto,
      fontWeight: "bold",
      fontSize: 16,
    },
    linhaEntre: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 8,
    },
    caixaConectado: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: cores.cartao,
      borderRadius: 14,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
    },
    botao: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    textoBotao: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
    },
    botaoResetar: {
      marginTop: 12,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    botaoLimpar: {
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 10,
    },
    telemetriaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    telemetriaItem: {
      backgroundColor: cores.fundoBloco,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: cores.borda,
      width: '40%',
      marginBottom: 16,
    },
    telemetriaItemTituloRow: {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: 0.7,
    },
    telemetriaItemTitulo: {
      color: cores.texto,
      fontSize: 13,
      marginLeft: 6,
      fontWeight: '600',
    },
    telemetriaLinhaDado: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      paddingLeft: 4,
    },
    telemetriaRotuloDado: {
      color: cores.texto,
      fontSize: 14,
      opacity: 0.9,
    },
    telemetriaValorDado: {
      color: cores.texto,
      fontSize: 14,
      fontWeight: '600',
    },
    linhaPosicao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: cores.borda,
      marginTop: 8,
      paddingTop: 16,
    },
    comandosGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    botaoComandoPrimario: {
      width: '48%',
      marginBottom: 12,
      paddingVertical: 16,
      borderRadius: 10,
      backgroundColor: cores.primaria,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    botaoComandoSecundario: {
      width: '48%',
      marginBottom: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: cores.fundoBloco,
      borderWidth: 1,
      borderColor: cores.borda,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    slider:{
      marginTop: "2%",
      height: 20,
    }
  });
}

function estilosCartao(cores) {
  return StyleSheet.create({
    cartao: {
      backgroundColor: cores.cartao,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    tituloContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    tituloEsquerda: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titulo: {
      color: cores.texto,
      fontSize: 18,
      fontWeight: "700",
    },
    badge: {
      backgroundColor: cores.sucesso,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeTexto: {
      color: '#000000ff',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
}