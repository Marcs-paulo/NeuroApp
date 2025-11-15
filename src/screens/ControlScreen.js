import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from "react-native-reanimated";

export default function TelaControle() {
  const tema = useColorScheme();
  const modoEscuro = tema === "dark";
  const navigation = useNavigation();

  const raioJoystick = 60;

  const [velocidadeAtual, setVelocidadeAtual] = useState(0);
  const [rotacaoAtual, setRotacaoAtual] = useState(0);

  const joystickEsqY = useSharedValue(0);
  const joystickDirX = useSharedValue(0);

  useEffect(() => {
    Orientation.lockToLandscapeRight();
    return () => Orientation.unlockAllOrientations();
  }, []);

  const enviarComando = ({ velocidade, rotacao }) => {
    // Aqui você substitui pelo envio real: BLE, Socket, etc.
    console.log("Enviando comando -> Velocidade:", velocidade, "Rotação:", rotacao);
  };


  const gestoEsquerdo = Gesture.Pan()
    .maxPointers(1)
    .onUpdate((e) => {
      joystickEsqY.value = Math.max(-raioJoystick, Math.min(raioJoystick, e.translationY));
      const val = Math.max(-1, Math.min(1, -e.translationY / raioJoystick));
      runOnJS(setVelocidadeAtual)(val);
      runOnJS(enviarComando)({ velocidade: val, rotacao: rotacaoAtual });
    })
    .onEnd(() => {
      joystickEsqY.value = withSpring(0);
      runOnJS(setVelocidadeAtual)(0);
      runOnJS(enviarComando)({ velocidade: 0, rotacao: rotacaoAtual });
    });


  const gestoDireito = Gesture.Pan()
    .maxPointers(1)
    .onUpdate((e) => {
      joystickDirX.value = Math.max(-raioJoystick, Math.min(raioJoystick, e.translationX));
      const val = Math.max(-1, Math.min(1, e.translationX / raioJoystick));
      runOnJS(setRotacaoAtual)(val);
      runOnJS(enviarComando)({ velocidade: velocidadeAtual, rotacao: val });
    })
    .onEnd(() => {
      joystickDirX.value = withSpring(0);
      runOnJS(setRotacaoAtual)(0);
      runOnJS(enviarComando)({ velocidade: velocidadeAtual, rotacao: 0 });
    });

  const estiloAnimadoEsquerdo = useAnimatedStyle(() => ({
    transform: [{ translateY: joystickEsqY.value }],
  }));

  const estiloAnimadoDireito = useAnimatedStyle(() => ({
    transform: [{ translateX: joystickDirX.value }],
  }));

  const cores = modoEscuro
    ? {
      fundo: "#1a1a1a",
      cartao: "#242424",
      texto: "#e6e6e6",
      primaria: "#1e6fb9"
    }
    : {
      fundo: "#e2e8f0",
      cartao: "#f1f5f9",
      texto: "#1e293b",
      primaria: "#4d98e2"
    };

  const estilos = getStyles(cores);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={estilos.tela}>
        {/* JOYSTICK ESQUERDO */}
        <View style={estilos.containerJoystick}>
          <GestureDetector gesture={gestoEsquerdo}>
            <View style={estilos.baseJoystick}>
              <Animated.View style={[estilos.joystick, estiloAnimadoEsquerdo]} />
            </View>
          </GestureDetector>
          <Text style={estilos.rotuloJoystick}>VELOCIDADE</Text>
        </View>

        {/* BOTÃO VOLTAR */}
        <View style={estilos.containerStatus}>
          <Text style={estilos.textoVoltar} onPress={() => navigation.goBack()}>
            Voltar
          </Text>
        </View>

        {/* JOYSTICK DIREITO */}
        <View style={estilos.containerJoystick}>
          <GestureDetector gesture={gestoDireito}>
            <View style={estilos.baseJoystick}>
              <Animated.View style={[estilos.joystick, estiloAnimadoDireito]} />
            </View>
          </GestureDetector>
          <Text style={estilos.rotuloJoystick}>ROTAÇÃO</Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function getStyles(cores) {
  return StyleSheet.create({
    tela: {
      flex: 1,
      backgroundColor: cores.fundo,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    containerStatus: {
      flex: 1.2,
      justifyContent: "center",
      alignItems: "center",
    },
    containerJoystick: {
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    baseJoystick: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: cores.cartao,
      justifyContent: "center",
      alignItems: "center",
    },
    joystick: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: cores.primaria,
    },
    rotuloJoystick: {
      marginTop: 12,
      color: cores.texto,
      fontWeight: "bold",
      fontSize: 14,
    },
    textoVoltar: {
      color: cores.primaria,
      fontWeight: "bold",
      fontSize: 16,
      padding: 10,
    },
  });
}
