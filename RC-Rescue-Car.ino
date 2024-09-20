#include <WiFi.h>
#include <WebSocketsServer_Generic.h>

const char* ssid = "Realme";
const char* password = "99999999";

WebSocketsServer webSocket = WebSocketsServer(81);

char wsSignal;
int Speed = 160;

#define R 0
#define L 1

int enA = 5;
int enB = 23;
int IN1 = 22;
int IN2 = 21;
int IN3 = 19;
int IN4 = 18;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    wsSignal = (char)payload[0];

    Serial.println(wsSignal);

    if (wsSignal == 'B') backward();
    else if (wsSignal == 'F') forward();
    else if (wsSignal == 'L') left();
    else if (wsSignal == 'R') right();
    else if (wsSignal == 'S') stop();
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
  Serial.println("Connected to WiFi");
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  pinMode(enA, OUTPUT);
  pinMode(enB, OUTPUT);
  
  ledcSetup(R, 5000, 8);
  ledcAttachPin(enA, R);
  ledcSetup(L, 5000, 8);
  ledcAttachPin(enB, L);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  stop();
}

void loop() {
  webSocket.loop();
}

void backward() {
  ledcWrite(R, Speed);
  ledcWrite(L, Speed);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void forward() {
  ledcWrite(R, Speed);
  ledcWrite(L, Speed);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void left() {
  ledcWrite(R, Speed);
  ledcWrite(L, Speed);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void right() {
  ledcWrite(R, Speed);
  ledcWrite(L, Speed);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void stop() {
  ledcWrite(R, 0);
  ledcWrite(L, 0);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}