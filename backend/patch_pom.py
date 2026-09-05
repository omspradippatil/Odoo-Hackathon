import xml.etree.ElementTree as ET
tree = ET.parse('/Users/om/Desktop/Projects/Odoo-Hackathon/backend/pom.xml')
root = tree.getroot()
ns = {'mvn': 'http://maven.apache.org/POM/4.0.0'}
ET.register_namespace('', 'http://maven.apache.org/POM/4.0.0')

# Update the dependency version
deps = root.find('mvn:dependencies', ns)
for dep in deps.findall('mvn:dependency', ns):
    if dep.find('mvn:artifactId', ns).text == 'lombok':
        version_elem = dep.find('mvn:version', ns)
        if version_elem is not None:
            version_elem.text = '1.18.48'
        else:
            v = ET.SubElement(dep, 'version')
            v.text = '1.18.48'

build = root.find('mvn:build', ns)
plugins = build.find('mvn:plugins', ns)

for plugin in plugins.findall('mvn:plugin', ns):
    if plugin.find('mvn:artifactId', ns).text == 'maven-compiler-plugin':
        paths = plugin.find('mvn:configuration', ns).find('mvn:annotationProcessorPaths', ns)
        for path in paths.findall('mvn:path', ns):
            if path.find('mvn:artifactId', ns).text == 'lombok':
                path.find('mvn:version', ns).text = '1.18.48'

tree.write('/Users/om/Desktop/Projects/Odoo-Hackathon/backend/pom.xml', xml_declaration=True, encoding='UTF-8')
