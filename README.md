# Permissions

Permissions enables users to create Components, Permissions and Roles, and map component permissions to roles. It includes the following functionalities:

* Manage Components (create, view and edit components)
* Manage Component Permissions (create, view and edit component permissions)
* Manage Roles (create, view, and edit roles, their allowable hierarchy levels and their restricted role status)
* Map Roles to  Component Permissions (create and manage mappings between roles and component permissions)

## License ##
This project is licensed under the [AIR Open Source License v1.0](http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf).

## Getting Involved ##
We would be happy to receive feedback on its capabilities, problems, or future enhancements:

* For general questions or discussions, please use the [Forum](http://forum.opentestsystem.org/viewforum.php?f=8).
* Use the **Issues** link to file bugs or enhancement requests.
* Feel free to **Fork** this project and develop your changes!

## Module Overview

### Webapp
The Webapp module contains the Permissions UI and REST APIs.

## Setup
In general, building the code and deploying the WAR file is a good first step.  Permissions, however, has a number of other steps that need to be performed in order to fully set up the system.

### Config Folder
Within the file system of the deployment (local file system if running locally or within Tomcat file directories), create a configuration folder structure as follows:
```
{CONFIG-FOLDER-NAME}/progman/
example: /my-app-config/progman/
``` 
Within the deepest folder ('/progman/'), place a file named 'pm-client-security.properties' with the following contents:

```
#security props
oauth.access.url={the URL of OAuth2 access token provider}
pm.oauth.client.id={Client ID for program management client, can be shared amongst all client users or application/consumer specific values}
pm.oauth.client.secret={Password for program management client, can be shared amongst all client users or application/consumer specific values}
pm.oauth.batch.account={OAuth Client id configured in OAM to allow get an OAuth token for the ‘batch' web service call to program management(for loading configs during start up)}
pm.oauth.batch.password={OAuth Client secret/password configured in OAM to allow get an OAuth token for the ‘batch' web service call to program management(for loading configs during start up)}

working example:
oauth.access.url=https://<openam-url>/auth/oauth2/access_token?realm=/your-realm
pm.oauth.client.id=pm
pm.oauth.client.secret=OAUTHCLIENTSECRET
pm.oauth.batch.account=test@example.com
pm.oauth.batch.password=<password>
```
Add environment variable `-DSB11_CONFIG_DIR` to application server startup as shown in Tomcat (Run Configuration)

### Tomcat (Run Configuration)
Like other SBAC applications, Permissions must be set up with active profiles and program management settings.

* `-Dspring.profiles.active`  - Active profiles should be comma separated. Typical profiles for the `-Dspring.profiles.active` include:
	* `progman.client.impl.integration`  - Use the integrated program management
	* `progman.client.impl.null`  - Use the program management null implementation
	* `mna.client.integration`  - Use the integrated MnA component
	* `mna.client.null`  - Use the null MnA component
* `-Dprogman.baseUri`  - This URI is the base URI where the Program Management REST module is deployed.
*  `-Dprogman.locator`  - The locator variable describes which combinations of name and environment (with optional overlay) should be loaded from Program Management.  For example: ```"component1-urls,dev"``` would look up the name component1-urls for the dev environment at the configured REST endpoint.  Multiple lookups can be performed by using a semicolon to delimit the pairs (or triplets with overlay): ```"component1-urls,dev;component1-other,dev"```
*  `-DSB11_CONFIG_DIR`  - Locator string needed to find the Permissions properties to load.
*  `-Djavax.net.ssl.trustStore`  - Location of .jks file which contains security certificates for SSO, Program Management and Permission URLs specified inside baseuri and Program Management.
*  `-Djavax.net.ssl.trustStorePassword`  - Password string for the keystore.jks file.

```
 Example:
-Dspring.profiles.active="progman.client.impl.integration,mna.client.integration" 
-Dprogman.baseUri=http://<program-management-url>/programmanagement.rest/ 
-Dprogman.locator="permissions,local" 
-DSB11_CONFIG_DIR=<CONFIG-FOLDER-NAME>
-Djavax.net.ssl.trustStore="<filesystem_dir>/saml_keystore.jks" 
-Djavax.net.ssl.trustStorePassword="xxxxxx"
```

## Program Management Properties
Program Management properties need to be set for running Permissions. Example of Permissions properties at [/Documents/Installation/permissions-progman-config.txt](https://bitbucket.org/sbacoss/permissionsdev/src/40a46fbe32472e8b3ca76386ae2863a19af2e504/Documents/Installation/permissions-progman-config.txt?at=default)

#### Database Properties
The following parameters need to be configured inside program management for database.

* `datasource.url=jdbc:mysql://localhost:3306/schemaname`  - The JDBC URL of the database from which Connections can and should be acquired.
* `datasource.username=<db-username>`  -  Username that will be used for the DataSource's default getConnection() method. 
* `encrypt:datasource.password=<db-password>`  - Password that will be used for the DataSource's default getConnection() method.
* `datasource.driverClassName=com.mysql.jdbc.Driver`  - The fully qualified class name of the JDBC driverClass that is expected to provide Connections.
* `datasource.minPoolSize=5`  - Minimum number of Connections a pool will maintain at any given time.
* `datasource.acquireIncrement=5`  - Determines how many connections at a time datasource will try to acquire when the pool is exhausted.
* `datasource.maxPoolSize=20`  - Maximum number of Connections a pool will maintain at any given time.
* `datasource.checkoutTimeout=60000`  - The number of milliseconds a client calling getConnection() will wait for a Connection to be checked in or acquired when the pool is exhausted. Zero means wait indefinitely. Setting any positive value will cause the getConnection() call to time out and break with an SQLException after the specified number of milliseconds.
* `datasource.maxConnectionAge=0`  - Seconds, effectively a time to live. A Connection older than maxConnectionAge will be destroyed and purged from the pool. This differs from maxIdleTime in that it refers to absolute age. Even a Connection which has not been idle will be purged from the pool if it exceeds maxConnectionAge. Zero means no maximum absolute age is enforced. 
* `datasource.acquireRetryAttempts=5`  - Defines how many times datasource will try to acquire a new Connection from the database before giving up. If this value is less than or equal to zero, datasource will keep trying to fetch a Connection indefinitely.

#### MNA Properties
Following parameters need to be configured inside program management for MNA.	

* `mna.mnaUrl=http://<mna-context-url>/mna-rest/`  - URL of the Monitoring and Alerting client server's rest url.
* `mnaServerName=permission_dev`  -  Used by the mna clients to identify which server is sending the log/metrics/alerts.
* `mnaNodeName=dev`  - Used by the mna clients to identify who is sending the log/metrics/alerts. There is a discrete mnaServerName and a node for server name & node1/node2 in a clustered environment giving the ability to search across clustered nodes by server name or for a given spcific node. it’s being stored in the DB for metric/log/alert, but is not displayed.
* `mna.logger.level=ERROR`  - Used to control what is logged to the Monitoring and Alerting system. Logging levels: ALL (turn on all logging levels), TRACE, DEBUG, INFO, WARN, ERROR, OFF (turn off logging).


#### SSO Properties
The following parameters need to be configured inside program management for SSO.	

* `permission.uri=https://<permission-app-context-url>/rest`  - The base URL of the REST api for the Permissions application.
* `permission.security.profile=dev`  - The name of the environment the application is running in. For a production deployment this will most likely be "prod." Must match the profile name used to name metadata files.
* `component.name=Permissions`  - The name of the component that this Permissions deployment represents. This must match the name of the component in Program Management and the name of the component in the Permissions application.
* `permission.security.idp=https://<idp-url>`  - The URL of the SAML-based identity provider (OpenAM).
* `permission.webapp.saml.metadata.filename=permissions_local_sp.xml`  -  OpenAM Metadata file name uploaded for environment and placed inside server directory. 
* `permission.security.dir=file:////<sp-file-location-folder>`  - Location of the metadata file.
* `permission.security.saml.keystore.cert=<cert-name>`  - Name of the Keystore cert being used.
* `permission.security.saml.keystore.pass=<password>`  -  Password for keystore cert.
* `permission.security.saml.alias=permissions_webapp`  - Alias for identifying web application.
* `oauth.tsb.client=tsb`  - OAuth Client id configured in OAM to allow the SAML bearer workflow to convert a SAML assertion into an OAuth token for the ‘coordinated web service” call to TSB.
* `oauth.access.url=https://<oauth-url>`  -  OAuth URL to OAM to allow the SAML bearer workflow to POST to get an OAuth token for any ‘machine to machine calls requiring OAuth.
* `encrypt:oauth.tsb.client.secret=<password>`  - OAuth Client secret/password configured in OAM (under the client id) to allow the SAML bearer workflow to convert a SAML assertion into an OAuth token for the "coordinated web service” call to TSB.
* `encrypt:mna.oauth.client.secret=<password>`  -  OAuth Client secret/password configured in OAM to allow get an OAuth token for the "batch" web service call to MnA.
* `mna.oauth.client.id=mna`  - OAuth Client ID configured in OAM to allow get an OAuth token for the "batch" web service call to MnA.
* `encrypt:permission.oauth.resource.client.secret=<password>`  -   OAuth client secret/password configured in OAM to allow get an OAuth token for the "batch" web service call to permissions.
* `permission.oauth.resource.client.id=permissions`  -  OAuth Client ID configured in OAM to allow get an OAuth token for the "batch" web service call to Permissions.
* `permission.oauth.checktoken.endpoint=http://<oauth-url>`  -  OAuth URL to OAM to allow the SAML bearer workflow to perform a GET to check that an OAuth token is valid.

## SP Metadata file for SSO
Create metadata file for configuring the SSO. Sample SSO metadata file pointing to localhost is at [/Documents/Installation/permission_local_sp.xml](https://bitbucket.org/sbacoss/permissionsdev/src/40a46fbe32472e8b3ca76386ae2863a19af2e504/Documents/Installation/permission_local_sp.xml?at=default)
Change the entity id and url according to the environment. Upload this file to OpenAM and place this file inside server file system.
Specify `permission.webapp.saml.metadata.filename` and `permission.security.dir` in program management for metadata file name and location.
```
Example:
permission.webapp.saml.metadata.filename=permission_local_sp.xml
permission.security.dir=file:////usr/securitydir
```


## Build
These are the steps that should be taken in order to build all of the Permissions related artifacts.

### Pre-Dependencies
* Tomcat 6 or higher
* Maven (mvn) version 3.X or higher installed
* Java 7
* Access to shared-web repository
* Access to rest-api-generator repository
* Access to sb11-shared-build repository
* Access to sb11-shared-code repository
* Access to sb11-security repository
* Access to sb11-rest-api-generator repository
* Access to sb11-program-management repository
* Access to sb11-monitoring-alerting-client repository

### Build Order

If building all components from scratch the following build order is needed:

* shared-web
* rest-api-generator
* sb11-shared-security
* sb11-shared-code
* prog-mgmnt-client
* prog-mgmnt-client-null-impl
* monitoring-alerting.client-null-impl
* monitoring-alerting.client

## Dependencies
Permissions has a number of direct dependencies that are necessary for it to function.  These dependencies are already built into the Maven POM files.

### Compile Time Dependencies
* shared-web
* rest-api-generator
* sb11-shared-security
* sb11-shared-code
* prog-mgmnt-client
* prog-mgmnt-client-null-impl
* monitoring-alerting.client-null-impl
* monitoring-alerting.client
* mysql-connector-java
* spring-web
* spring-webmvc
* spring-beans
* spring-core
* spring-context
* spring-context-support
* spring-aop
* spring-security-core
* spring-aspects
* xercesImpl
* json-path-assert
* c3p0
* log4j
* jstl


### Test Dependencies
* shared-test
* shared-db-test
* junit


### Runtime Dependencies
* servlet-api
* jsp-api