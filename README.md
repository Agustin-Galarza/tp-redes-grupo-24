**TP ESPECIAL: Serverless GraphQL API**
=====================================

**Integrantes**

| Nombre | Matrícula |
| --- | --- |
| Luciana Diaz Kralj | 60495 |
| Alan Sartorio | 61379 |
| Agustín Galarza | 61481 |
| Agustín Benvenuto | 61448 |

**Requerimientos**
----------------

Tema 9: Serverless (GraphQL)
- Diseñar una API utilizando GraphQL (serverless) con 3 endpoints, donde al menos debe haber 1 método de inserción (Mutation) y dos consultas (Query)
- Los requests deben manejar e interpretar todo tipo de errores.
- Configure funciones (AWS Lambda, Azure Functions, GCP Functions) que atiendan a las solicitudes de la API y procese los datos de entrada si aplica.
- Todos los datos que se reciban en la inserción (Mutation) deberán ser almacenados en una base de datos serverless.
- El body de la función que utilizaron para la Mutation deberá tener un valor “name”. Caso contrario debe devolver el error.
- Cuando se hace una consulta (Query), deberá traer al menos un campo de la base de datos (dato que se almacenó allí por haber hecho previamente un POST).
- Mostrar gráficos con métricas en CloudWatch (o similar) de todos los componentes serverless.
- Explicar cómo escala el sistema anterior.
- Explique cuáles son las principales ventajas de usar GraphQL por sobre una API Rest
- Explicar cómo funciona y las ventajas de usar un servicio Serverless frente a un servidor común.
- Explique cómo utilizaría el servicio de Lambda (o similar) en otros dos escenarios que no sea con el fin de una API.
- ¿Cómo se podría configurar un proveedor de identidad como Cognito (o similar) para atender requests autenticados mediante token JWT? ¿Qué debe cambiar o que debe tener en cuenta a la hora de implementar el cambio?

**Deployment**
-------------

Para deployar el sistema en AWS Amplify, hay que crear una APP en AWS Amplify desde la consola de AWS y subir el código de este repositorio. Se puede subir manualmente o vincular con un repositorio de git al que se tenga acceso. Amplify se encarga de crear los recursos necesarios.

**Desarrollo Local**
-------------------

Para desarrollar localmente, hay que seguir los siguientes pasos:

1. Clonar este repositorio.
2. Descargar el archivo `amplify_outputs.json` desde la consola de AWS: Amplify -> Deployments -> Deployed backend resources -> Download amplify_outputs.json y ubicarlo en el root del repositorio.
3. Correr `npm install` desde el root del repositorio.
4. Correr `npm run dev`.

Este proceso levantará un servidor de desarrollo para el frontend, que utilizará la API desplegada en AWS.

**Notas**
----

* Al cambiar el modelo de datos, forzar un deploy un `git push` y descargar nuevamente el `amplify_outputs.json`
