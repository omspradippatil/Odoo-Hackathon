const fs = require('fs');
const path = '../backend/src/main/resources/application.properties';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'spring.datasource.url=jdbc:h2:mem:devflow_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE',
  'spring.datasource.url=jdbc:h2:file:./devflow_db;AUTO_SERVER=TRUE'
);

fs.writeFileSync(path, content);
