export const ROOMS = [
  // NIVEL 1 - BÁSICO (1-5)
  {
    id: 1, level_num: 1, name: "Variables y Tipos", icon: "📦",
    description: "Para entrar al sistema, debes entender cómo Python maneja los datos básicos.",
    skillTested: "variables_tipos",
    puzzle: {
      code: `x = "5" + "5"\ny = int(x) + 10\nprint(y)`,
      options: [
        { id: "a", text: "20", correct: false, level: 1 },
        { id: "b", text: "5510", correct: false, level: 2 },
        { id: "c", text: "65", correct: true, level: 3 },
        { id: "d", text: "Error: No se puede sumar str e int", correct: false, level: 1 },
      ],
      hint: "Pista: El primer '+' concatena strings porque '5' tiene comillas. Luego int() convierte '55' en número.",
      explanation: "x es '55' (string). int(x) lo convierte en 55. 55 + 10 = 65."
    }
  },
  {
    id: 2, level_num: 1, name: "Listas e Indexación", icon: "📋",
    description: "El pasillo de datos requiere precisión en la búsqueda por posición.",
    skillTested: "listas_indexacion",
    puzzle: {
      code: `data = [10, 20, 30, 40, 50]\nprint(data[-2:])`,
      options: [
        { id: "a", text: "[40, 50]", correct: true, level: 3 },
        { id: "b", text: "[30, 40, 50]", correct: false, level: 2 },
        { id: "c", text: "[40]", correct: false, level: 1 },
        { id: "d", text: "[50, 40]", correct: false, level: 2 },
      ],
      hint: "Pista: El índice -2 es el penúltimo. Los dos puntos ':' indican 'desde ahí hasta el final'.",
      explanation: "-2 es el 40. El slice [-2:] toma desde el 40 hasta el final de la lista."
    }
  },
  {
    id: 3, level_num: 1, name: "División de Datos", icon: "➗",
    description: "¿Sabes la diferencia entre las distintas formas de dividir en Python?",
    skillTested: "operadores",
    puzzle: {
      code: `a = 7 // 2\nb = 7 % 2\nprint(a, b)`,
      options: [
        { id: "a", text: "3.5 1", correct: false, level: 1 },
        { id: "b", text: "3 0.5", correct: false, level: 2 },
        { id: "c", text: "3.5 0.5", correct: false, level: 1 },
        { id: "d", text: "3 1", correct: true, level: 3 },
      ],
      hint: "Pista: // es división entera (suelo) y % es el resto (módulo).",
      explanation: "7 // 2 es 3 (cuántas veces cabe entero). 7 % 2 es 1 (el sobrante)."
    }
  },
  {
    id: 4, level_num: 1, name: "Cadenas de Texto", icon: "🔤",
    description: "Manipular texto es fundamental para procesar logs del sistema.",
    skillTested: "strings",
    puzzle: {
      code: `msg = "python"\nprint(msg.upper().replace("P", "J"))`,
      options: [
        { id: "a", text: "PYTHON", correct: false, level: 2 },
        { id: "b", text: "JYTHON", correct: true, level: 3 },
        { id: "c", text: "jython", correct: false, level: 1 },
        { id: "d", text: "Error: upper() no existe", correct: false, level: 1 },
      ],
      hint: "Pista: upper() lo pone todo en mayúsculas, incluido el carácter que quieres reemplazar.",
      explanation: "msg.upper() es 'PYTHON'. Reemplazar 'P' por 'J' resulta en 'JYTHON'."
    }
  },
  {
    id: 5, level_num: 1, name: "Booleanos y Lógica", icon: "⚖️",
    description: "La última puerta del nivel básico requiere evaluar condiciones simples.",
    skillTested: "logica_basica",
    puzzle: {
      code: `a = True\nb = False\nprint(not a or b and a)`,
      options: [
        { id: "a", text: "True", correct: false, level: 1 },
        { id: "b", text: "False", correct: true, level: 3 },
        { id: "c", text: "None", correct: false, level: 1 },
        { id: "d", text: "Error de sintaxis", correct: false, level: 2 },
      ],
      hint: "Pista: El orden de precedencia es 'not' primero, luego 'and', y al final 'or'.",
      explanation: "not True es False. False and True es False. False or False es False."
    }
  },
  {
    id: 6, level_num: 2, name: "Bucles y Flujo", icon: "🔄",
    description: "El sistema está atrapado en un ciclo. Debes predecir su salida.",
    skillTested: "bucles",
    puzzle: {
      code: `res = 0\nfor i in range(1, 5, 2):\n    res += i\nprint(res)`,
      options: [
        { id: "a", text: "4", correct: true, level: 3 },
        { id: "b", text: "9", correct: false, level: 2 },
        { id: "c", text: "6", correct: false, level: 2 },
        { id: "d", text: "1", correct: false, level: 1 },
      ],
      hint: "Pista: range(inicio, fin, paso). Empieza en 1, salta de 2 en 2, y no llega al 5.",
      explanation: "Los valores de i son 1 y 3 (el siguiente sería 5, pero range no incluye el límite superior). 1 + 3 = 4."
    }
  },
  {
    id: 7, level_num: 2, name: "Funciones y Scope", icon: "⚗️",
    description: "Cuidado con los argumentos. Python guarda secretos en las funciones.",
    skillTested: "funciones_scope",
    puzzle: {
      code: `def add_item(val, lista=[]):\n    lista.append(val)\n    return lista\n\nadd_item(1)\nprint(add_item(2))`,
      options: [
        { id: "a", text: "[2]", correct: false, level: 2 },
        { id: "b", text: "[1, 2]", correct: true, level: 3 },
        { id: "c", text: "[1]\n[2]", correct: false, level: 2 },
        { id: "d", text: "Error: lista no definida", correct: false, level: 1 },
      ],
      hint: "Pista: Los argumentos por defecto mutables (como []) se crean UNA sola vez al definir la función.",
      explanation: "Es el clásico 'Mutable Default Argument'. Ambas llamadas comparten la misma lista creada en la definición."
    }
  },
  {
    id: 8, level_num: 2, name: "List Comprehensions", icon: "⚡",
    description: "Optimiza el procesamiento de datos con una sola línea de código.",
    skillTested: "comprehensions",
    puzzle: {
      code: `nums = [1, 2, 3, 4]\nres = [x**2 for x in nums if x % 2 == 0]\nprint(res)`,
      options: [
        { id: "a", text: "[1, 4, 9, 16]", correct: false, level: 2 },
        { id: "b", text: "[4, 8]", correct: false, level: 2 },
        { id: "c", text: "[1, 9]", correct: false, level: 2 },
        { id: "d", text: "[4, 16]", correct: true, level: 3 },
      ],
      hint: "Pista: Filtra los pares (x % 2 == 0) y elévalos al cuadrado (x**2).",
      explanation: "Los pares son 2 y 4. Sus cuadrados son 2²=4 y 4²=16."
    }
  },
  {
    id: 9, level_num: 2, name: "Control de Errores", icon: "🛡️",
    description: "El sistema está fallando. ¿Cómo manejas las excepciones?",
    skillTested: "exceptions",
    puzzle: {
      code: `try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    x = 0\nfinally:\n    x = 10\nprint(x)`,
      options: [
        { id: "a", text: "0", correct: false, level: 2 },
        { id: "b", text: "10", correct: true, level: 3 },
        { id: "c", text: "Error", correct: false, level: 1 },
        { id: "d", text: "1", correct: false, level: 2 },
      ],
      hint: "Pista: El bloque 'finally' se ejecuta SIEMPRE, sin importar lo que haya pasado antes.",
      explanation: "Ocurre el error, el except pone x=0, pero el finally se ejecuta después de todo y sobreescribe x a 10."
    }
  },
  {
    id: 10, level_num: 2, name: "Global vs Local", icon: "🌐",
    description: "¿Dónde viven tus variables? El scope es vital para la estabilidad.",
    skillTested: "scope",
    puzzle: {
      code: `n = 5\ndef magic():\n    n = 10\nmagic()\nprint(n)`,
      options: [
        { id: "a", text: "5", correct: true, level: 3 },
        { id: "b", text: "10", correct: false, level: 2 },
        { id: "c", text: "None", correct: false, level: 1 },
        { id: "d", text: "Error: n is local", correct: false, level: 2 },
      ],
      hint: "Pista: La variable 'n' dentro de la función es local y no afecta a la 'n' global de fuera.",
      explanation: "Sin la palabra clave 'global', n=10 crea una nueva variable local. La 'n' de fuera sigue valiendo 5."
    }
  },
  {
    id: 11, level_num: 3, name: "Diccionarios", icon: "🗝️",
    description: "Las llaves del sistema han sido invertidas. Debes recuperarlas.",
    skillTested: "diccionarios",
    puzzle: {
      code: `d = {"a": 1, "b": 2}\ninv = {v: k for k, v in d.items()}\nprint(inv[2])`,
      options: [
        { id: "a", text: "2", correct: false, level: 1 },
        { id: "b", text: "{2: 'b'}", correct: false, level: 1 },
        { id: "c", text: "b", correct: true, level: 3 },
        { id: "d", text: "Error: KeyError", correct: false, level: 2 },
      ],
      hint: "Pista: La comprehension crea un nuevo dict invirtiendo clave y valor. Luego buscamos el valor original 2 como llave.",
      explanation: "El nuevo dict es {1: 'a', 2: 'b'}. inv[2] devuelve 'b'."
    }
  },
  {
    id: 12, level_num: 3, name: "Programación Funcional", icon: "🧩",
    description: "Lambda, Map y Filter combinados. Solo un experto puede leer esto.",
    skillTested: "funcional",
    puzzle: {
      code: `data = [1, 2, 3, 4]\nres = list(map(lambda x: x*2, \n          filter(lambda x: x > 2, data)))\nprint(res)`,
      options: [
        { id: "a", text: "[4, 6, 8]", correct: false, level: 2 },
        { id: "b", text: "[6, 8]", correct: true, level: 3 },
        { id: "c", text: "[2, 4, 6, 8]", correct: false, level: 2 },
        { id: "d", text: "[1, 2]", correct: false, level: 1 },
      ],
      hint: "Pista: El filter se ejecuta primero sobre data, luego el map se aplica al resultado filtrado.",
      explanation: "Filter(x>2) devuelve [3, 4]. Map(x*2) sobre eso devuelve [6, 8]."
    }
  },
  {
    id: 13, level_num: 3, name: "Sets y Desempaquetado", icon: "💎",
    description: "Los duplicados son ruido. Limpia la señal para avanzar.",
    skillTested: "sets",
    puzzle: {
      code: `s1 = {1, 2, 3}\ns2 = {3, 4, 5}\nprint(len(s1 | s2))`,
      options: [
        { id: "a", text: "6", correct: false, level: 2 },
        { id: "b", text: "1", correct: false, level: 1 },
        { id: "c", text: "3", correct: false, level: 2 },
        { id: "d", text: "5", correct: true, level: 3 },
      ],
      hint: "Pista: El operador '|' realiza la UNIÓN de los conjuntos, eliminando duplicados.",
      explanation: "La unión de s1 y s2 es {1, 2, 3, 4, 5}. Su longitud es 5."
    }
  },
  {
    id: 14, level_num: 3, name: "Clases y Objetos", icon: "🏗️",
    description: "El molde de la realidad. ¿Entiendes el comportamiento de los objetos?",
    skillTested: "oop",
    puzzle: {
      code: `class Bot:\n    def __init__(self, id):\n        self.id = id\n\nb1 = Bot(1)\nb2 = b1\nb2.id = 100\nprint(b1.id)`,
      options: [
        { id: "a", text: "100", correct: true, level: 3 },
        { id: "b", text: "1", correct: false, level: 2 },
        { id: "c", text: "Error: b1 no tiene id", correct: false, level: 1 },
        { id: "d", text: "None", correct: false, level: 1 },
      ],
      hint: "Pista: En Python, los objetos se asignan por referencia, no se copian automáticamente.",
      explanation: "b2 apunta al MISMO objeto que b1. Cambiar b2.id es cambiar b1.id."
    }
  },
  {
    id: 15, level_num: 3, name: "Generadores y Args", icon: "🌋",
    description: "La fase final. Control total sobre los argumentos variables.",
    skillTested: "advanced_args",
    puzzle: {
      code: `def calc(*args):\n    return sum(args[::2])\n\nprint(calc(1, 10, 2, 20, 3))`,
      options: [
        { id: "a", text: "36", correct: false, level: 2 },
        { id: "b", text: "30", correct: false, level: 1 },
        { id: "c", text: "6", correct: true, level: 3 },
        { id: "d", text: "Error", correct: false, level: 2 },
      ],
      hint: "Pista: *args recoge todo en una tupla. [::2] toma elementos saltando de 2 en 2.",
      explanation: "args es (1, 10, 2, 20, 3). args[::2] es (1, 2, 3). La suma es 6."
    }
  }
];

export const SKILL_LABELS = {
  variables_tipos: "Variables y Tipos",
  listas_indexacion: "Listas",
  operadores: "Operadores",
  strings: "Cadenas de Texto",
  logica_basica: "Booleanos",
  bucles: "Bucles y Flujo",
  funciones_scope: "Funciones",
  comprehensions: "Comprehensions",
  exceptions: "Exceptions",
  scope: "Scope",
  diccionarios: "Diccionarios",
  funcional: "Prog. Funcional",
  sets: "Sets",
  oop: "Objetos",
  advanced_args: "Args Avanzados"
};
