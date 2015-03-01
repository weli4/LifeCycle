<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

Hello!
<br/>

<a href="<c:url value="/workspace"/>" accesskey=""> Workspace </a>
<br/>
<a href="<c:url value="/saati"/>" >Saati</a>




<%@ include file="/WEB-INF/jsp/footer.jsp" %>