<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <link href="/resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="/resources/css/style.css" rel="stylesheet">
    <link href="/resources/css/jquery-ui.custom.min.css" rel="stylesheet">
    <link href="/resources/css/font-awesome.min.css" rel="stylesheet">
    <script src="/resources/js/jquery.min.js"></script>
    <script src="/resources/js/bootstrap.min.js"></script>
    <script src="/resources/js/jquery-ui.custom.js"></script>
    <title>Анализ альтернатив</title>
</head>
<body>
<div class="container">
    <div class="row header">
        <button type="button" class="btn btn-primary">Модель ЖЦ</button>
        <button type="button" class="btn btn-primary">Выбор Альтернатив</button>
    </div>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>

<script type="text/javascript" src="<c:url value="/resources/js/dss.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.keyfilter-1.7.min.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/saati.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/dynamic-saati.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.flot.min.js"/>"> </script>




<br />
<div id="dop_bg">
    <div class="up_div">
        <h1 style="text-align:center;">Многокритериальный анализ альтернатив по методу Т.Саати</h1>

        <div class="clearfloat"></div>
    </div>
    <div class="r-border-shape">
        <div class="tb">
            <div class="cn l" ></div>
            <div class="cn r"></div>
        </div>
        <div class="content_box" style="padding-left: 30px;">

            <script language="JavaScript">
                var CATEGORY = -2;
            </script>
            <h2>Анализ альтернатив</h2>

            <br /><br />
            Для указания уровня приоритета используйте числа от 1/9 до 9.
            <br /><br />
            <span id="legend_helper"></span>
            <br />
            <span id="input_helper" style="padding: 3px; background-color: red;font-weight: bold;color: white;display:none;"></span>
            <br /><br />
            <div style="float:left;width:350px;">
                <div id="matrix" >
                    <form name="matrix">
                        <table cellpadding="0" cellspacing="0">
                            <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                                <tr>
                                    <c:forEach var="j" begin="0" end="${alternativesNumber - 1}" >
                                        <c:choose>
                                            <c:when test="${j!=i}">
                                                <td><input type="text" name="matrix[${i}][${j}]" required="true" > </td>
                                            </c:when>
                                            <c:otherwise>
                                                <td><input type="text" name="matrix[${i}][${j}]" value="1" readonly="true" > </td>
                                            </c:otherwise>
                                        </c:choose>
                                    </c:forEach>
                                    <td class="legend_y">&#${65+i};</td>
                                </tr>
                            </c:forEach>


                            <tr>
                                <c:forEach var="i" begin="0" end="${alternativesNumber-1}">
                                    <td class="legend_x">&#${65+i};</td>
                                </c:forEach>

                                <td class="legend_x"></td>
                            </tr>
                        </table>
                    </form>
                </div>
                <br />
                <input type="button" name="calc_dynamic_matrix" value="Рассчитать"/>
                <input type="button" name="toggle_dynamic" value="Сделать коэф. диманичным"  >
            </div>
            <div id="dynamic_legend" hidden="true" >
                Описание динамических полей:
               <ol id="dynamic_legend_ol" type="1" >
               </ol>
            </div>
            <div id="legend" style="padding-left: 70px;float:left">
                <b>Легенда:</b>
                <ol id="legend_ol" type="A">
                    <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                        <li>${alternativesArray[i]}<span></span></li>
                    </c:forEach>
                </ol>
                <br />
                <div id="matrix_helper_no" class="matrix_result" style="display:none;color:red;">
                    Матрица не согласованна. Пересмотрите значения матрицы.
                </div>
                <div id="matrix_helper_yes" class="matrix_result" style="display:none;color:green;">
                    Матрица согласованна.
                </div>
                <br />
                <div id="vectors" class="matrix_result" style="display:none;">
                    Собственные векторы: <br />
                    <span id="vector"></span>
                </div>
                <div class="parametrs matrix_result" style="display:none;">
                    Индексы: <br />
                    λ = <span id="lambda"></span><br />
                    ИС = <span id="cons_index"></span><br />
                    ОC = <span id="attit_cons"></span>
                </div>
                <br/>

            </div>
            <div id="dynamic_control" style="float:left; padding: 20px;" hidden="true">
                Настройка динамичекского поля:
                <select id="cell_dynamic_type">
                    <option value="linear">a(t)+b</option>
                    <option value="">a*log(t+1)+b</option>
                    <option value="">a*exp(b*t)+c</option>
                    <option value="">a*t&#178 + b*t + c</option>

                </select>
                <br/>
                <table>
                    <tr>
                        <td>Нижний предел:</td>
                        <td><input type="text" title="нижний предел" id="low_limit_input" /></td>
                    </tr>
                    <tr>
                        <td>Верхний предел:</td>
                        <td><input type="text" title="верхний предел" id="high_limit_input"/></td>
                    </tr>
                    <tr>
                        <td>Шаг:</td>
                        <td><input type="text" title="шаг" id="step_input"/></td>
                    </tr>
                    <tr>
                        <td>Коэф. а :</td>
                        <td><input type="text" title="a" id="a"/> </td>
                    </tr>
                    <tr>
                        <td>Коэф. b :</td>
                        <td><input type="text" title="b" id="b"/></td>
                    </tr>

                </table>
                <%--Нижний предел:--%>
                <%--<input type="text" title="нижний предел" id="low_limit_input" />  <br/>--%>

                <%--Верхний предел:--%>
                <%--<input type="text" title="верхний предел" id="high_limit_input"/> <br/>--%>

                <%--Шаг:--%>
                <%--<input type="text" title="шаг" id="step_input"/>   <br/>--%>
                <%--Коэф. а :--%>
                <%--<input type="text" title="a" id="a"/>      <br/>--%>
                <%--Коэф. b :--%>
                <%--<input type="text" title="b" id="b"/>   <br/>--%>
            </div>

            <div style="clear:both"></div>
            <br />
        </div>
        <div class="bb">
            <div class="cn l"></div>
            <div class="cn r"></div>
        </div>
    </div>
    <div class="up_div">
        <div id="placeholder" style="width:600px;height:300px;">
            <div class="axisLabel yaxisLabel" style="margin-top: 34.5px;">Response Time (ms)</div>
        </div>
        <div >
            &copy;&nbsp;&nbsp;МИРЭА
        </div>
    </div>
</div>



<%@ include file="/WEB-INF/jsp/footer.jsp" %>