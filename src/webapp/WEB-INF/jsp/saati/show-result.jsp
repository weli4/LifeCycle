<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>



<br/>
<div class="jumbotron">
    <h2> Результаты вычислений</h2>
    <ol id="legend_ol" >
        <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
            <li>Вес ${alternativesArray[i]} : <span> ${resultArray[i]}</span></li>
        </c:forEach>
    </ol>
</div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>
