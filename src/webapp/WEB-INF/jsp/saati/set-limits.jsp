<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>


SET - LIMITS BITCH

<form >
    <input type="submit" formmethod="POST" id="submit_button" value="Далее" />
    <br/>
    <br/>
    <div id="limits_div">
        <ol id="limits_ordered_list">
            <li>
               Нижний лимит : <input type="text" name="low_limit"/>
            </li>
            <li>
               Верхний лимит : <input type="text" name="top_limit"/>
            </li>
            <li>
                Шаг изменения : <input type="text" name="step"/>
            </li>
        </ol>

    </div>

</form>



<%@ include file="/WEB-INF/jsp/footer.jsp" %>