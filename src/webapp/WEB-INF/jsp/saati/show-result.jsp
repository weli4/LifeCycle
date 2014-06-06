<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>


Результаты вычислений
<br/>
<ol id="legend_ol" >
    <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
        <li>Вес ${alternativesArray[i]} : <span> ${resultArray[i]}</span></li>
    </c:forEach>
</ol>



<%@ include file="/WEB-INF/jsp/footer.jsp" %>