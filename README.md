# NeuroApp: Interface de Controle para Robô Autônomo

## 📖 Sobre o Projeto

O **NeuroApp** é uma aplicação móvel multiplataforma, desenvolvida em **React Native**, que serve como interface principal para o controle, monitoramento e telemetria de um robô autônomo baseado em **ESP32**.

O objetivo é fornecer uma ferramenta robusta para desenvolvedores e operadores realizarem testes, validação de hardware/firmware e acompanhamento de dados em tempo real. A aplicação utiliza **Bluetooth Low Energy (BLE)** para comunicação local e foi desenvolvida no âmbito do curso de **Engenharia de Computação da Universidade Federal do Rio Grande do Norte (UFRN)**.

## 🎥 Vídeo de Demonstração

Assista a uma explicação e demonstração completa do aplicativo em funcionamento:

[Link para o Vídeo Explicativo (Google Drive)](https://drive.google.com/file/d/1nU_DRxeS7qWa7miMxHkyYkk1VPYVPm7S/view?usp=sharing)


## 📄 Documentação Completa

Para uma análise aprofundada da arquitetura, módulos, diagramas e referências do projeto, consulte a documentação oficial em PDF:

[Baixar Documentação NeuroApp.pdf](https://raw.githubusercontent.com/Marcs-paulo/NeuroApp/main/Documentacao_NeuroApp.pdf)

## ✨ Principais Funcionalidades

- **Painel de Controle (Dashboard)**: Monitoramento em tempo real do status da conexão, telemetria (encoders, odometria, GPS), logs do sistema e envio de comandos (Start, Reset, Calibração).  
- **Controle Manual**: Tela dedicada com dois joysticks virtuais (usando `react-native-gesture-handler` e `reanimated`) para controle preciso de velocidade linear e rotação angular.  
- **Conectividade BLE**: Gerenciamento robusto de conexão Bluetooth Low Energy para comunicação estável com o hardware (ESP32).  
- **Interface Modular**: Layout organizado em "cartões" independentes para fácil manutenção e visualização dos dados.

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)  
- [Bluetooth Low Energy (react-native-ble-plx)](https://github.com/dotintent/react-native-ble-plx)  
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)  
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)  
- [React Native Orientation Locker](https://github.com/wonday/react-native-orientation-locker)  
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
