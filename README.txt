Add JDBC resource information as well as logger configurations 
into Tomcat's context.xml file in $CATALINA_HOME/conf:

        <Resource name="jdbc/permissionsdb" auth="Container"
	                type="javax.sql.DataSource" username="db_username_here" password="your_password_here"
	                driverClassName="com.mysql.jdbc.Driver"
	                url="jdbc:mysql://db_server_hostname:3306/db_name"
	                validationQuery="select 1" maxActive="5" maxIdle="2" removeAbandoned="true"
                logAbandoned="true" />
	<Parameter name="logger.proctorDevLogPath" value="logfile_path/"
			override="false" />
	<Parameter name="logger.debuglevel" value="DEBUG" override="false" />
	<Parameter name="permissions.xml.resource" value="path/to/permissions-resource.xml" override="false" />

   
To Include the Third Party bootstrapconnector-1.0.jar
mvn deploy:deploy-file -DgroupId=org.libreoffice -DartifactId=bootstrapconnector -Dversion=1.0 -Dpackaging=jar -Dfile=bootstrapconnector-1.0.jar -Durl=file://${project.basedir}/lib -DrepositoryId=local-project-libraries

where ${project.basedir} is e.g. C:\WorkSpace\SBAC\permissionsdev\Permissions