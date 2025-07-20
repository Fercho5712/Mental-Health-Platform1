import json
import statistics
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from typing import Dict, List, Any, Tuple
import os

class InsightGenerator:
    """Generate comprehensive insights from mental health platform data."""
    
    def __init__(self):
        self.insight_categories = {
            'engagement': 'Patrones de Participación',
            'emotional': 'Análisis Emocional',
            'behavioral': 'Patrones de Comportamiento',
            'therapeutic': 'Progreso Terapéutico',
            'risk': 'Evaluación de Riesgos',
            'recommendations': 'Recomendaciones'
        }
    
    def generate_comprehensive_insights(self, 
                                     chat_analysis: Dict = None,
                                     mood_analysis: Dict = None,
                                     crisis_analysis: Dict = None) -> Dict[str, Any]:
        """Generate comprehensive insights from all analysis types."""
        
        insights = {
            'summary': self.generate_executive_summary(chat_analysis, mood_analysis, crisis_analysis),
            'engagement_insights': self.analyze_engagement_patterns(chat_analysis),
            'emotional_insights': self.analyze_emotional_patterns(mood_analysis),
            'behavioral_insights': self.analyze_behavioral_patterns(chat_analysis, mood_analysis),
            'therapeutic_insights': self.analyze_therapeutic_progress(chat_analysis, mood_analysis),
            'risk_insights': self.analyze_risk_factors(crisis_analysis),
            'recommendations': self.generate_actionable_recommendations(chat_analysis, mood_analysis, crisis_analysis),
            'generated_at': datetime.now().isoformat()
        }
        
        return insights
    
    def generate_executive_summary(self, chat_analysis, mood_analysis, crisis_analysis) -> Dict[str, Any]:
        """Generate executive summary of user's mental health status."""
        summary = {
            'overall_status': 'EVALUANDO',
            'key_findings': [],
            'priority_areas': [],
            'positive_indicators': [],
            'concerns': []
        }
        
        # Analyze chat engagement
        if chat_analysis:
            total_messages = chat_analysis.get('user_messages', 0)
            if total_messages > 0:
                summary['key_findings'].append(f"Usuario activo con {total_messages} mensajes registrados")
                
                # Sentiment analysis
                sentiment_data = chat_analysis.get('sentiment_analysis', {})
                avg_sentiment = sentiment_data.get('average_sentiment', 0)
                
                if avg_sentiment > 0.2:
                    summary['positive_indicators'].append("Sentimiento general positivo en las conversaciones")
                    summary['overall_status'] = 'ESTABLE'
                elif avg_sentiment < -0.2:
                    summary['concerns'].append("Sentimiento general negativo en las conversaciones")
                    summary['overall_status'] = 'REQUIERE_ATENCION'
        
        # Analyze mood patterns
        if mood_analysis:
            mood_dist = mood_analysis.get('mood_distribution', {})
            if mood_dist:
                # Find dominant mood
                dominant_mood = max(mood_dist.items(), key=lambda x: x[1].get('percentage', 0))
                summary['key_findings'].append(f"Estado de ánimo predominante: {dominant_mood[0]} ({dominant_mood[1].get('percentage', 0):.1f}%)")
                
                # Check for concerning patterns
                negative_moods = ['depression', 'anxiety', 'anger', 'fear']
                negative_percentage = sum(
                    mood_dist.get(mood, {}).get('percentage', 0) 
                    for mood in negative_moods
                )
                
                if negative_percentage > 60:
                    summary['concerns'].append(f"Alto porcentaje de estados emocionales negativos ({negative_percentage:.1f}%)")
                    summary['priority_areas'].append("Manejo de emociones negativas")
                elif negative_percentage < 30:
                    summary['positive_indicators'].append("Buen equilibrio emocional general")
        
        # Analyze crisis risk
        if crisis_analysis and not crisis_analysis.get('insufficient_data'):
            avg_risk = crisis_analysis.get('average_recent_risk_score', 0)
            immediate_intervention = crisis_analysis.get('immediate_intervention_required', False)
            
            if immediate_intervention:
                summary['overall_status'] = 'CRISIS'
                summary['concerns'].append("Indicadores de crisis detectados - Intervención inmediata requerida")
                summary['priority_areas'].append("Intervención de crisis")
            elif avg_risk > 10:
                summary['overall_status'] = 'ALTO_RIESGO'
                summary['concerns'].append(f"Nivel de riesgo elevado (puntuación: {avg_risk:.1f})")
                summary['priority_areas'].append("Evaluación de riesgo y seguridad")
            elif avg_risk < 3:
                summary['positive_indicators'].append("Bajo nivel de indicadores de crisis")
        
        return summary
    
    def analyze_engagement_patterns(self, chat_analysis) -> Dict[str, Any]:
        """Analyze user engagement patterns."""
        if not chat_analysis:
            return {'no_data': True}
        
        insights = {
            'activity_level': 'BAJO',
            'consistency': 'IRREGULAR',
            'response_patterns': {},
            'recommendations': []
        }
        
        # Activity level analysis
        total_messages = chat_analysis.get('user_messages', 0)
        if total_messages >= 50:
            insights['activity_level'] = 'ALTO'
        elif total_messages >= 20:
            insights['activity_level'] = 'MEDIO'
        
        # Time patterns
        time_patterns = chat_analysis.get('time_patterns', {})
        if time_patterns:
            most_active_hour = time_patterns.get('most_active_hour')
            most_active_day = time_patterns.get('most_active_day')
            
            if most_active_hour is not None:
                insights['response_patterns']['preferred_hour'] = most_active_hour
                
                # Analyze timing implications
                if 22 <= most_active_hour or most_active_hour <= 6:
                    insights['recommendations'].append("Considerar horarios de sueño - actividad nocturna detectada")
                elif 9 <= most_active_hour <= 17:
                    insights['recommendations'].append("Actividad durante horario laboral - posible estrés relacionado con trabajo")
            
            if most_active_day:
                insights['response_patterns']['preferred_day'] = most_active_day
        
        # Message characteristics
        msg_chars = chat_analysis.get('message_characteristics', {})
        avg_length = msg_chars.get('average_length', 0)
        avg_response_time = msg_chars.get('average_response_time', 0)
        
        if avg_length > 100:
            insights['recommendations'].append("Mensajes detallados indican buena disposición para compartir")
        elif avg_length < 30:
            insights['recommendations'].append("Mensajes cortos - considerar técnicas para fomentar mayor expresión")
        
        if avg_response_time < 5:
            insights['consistency'] = 'MUY_ACTIVO'
        elif avg_response_time < 30:
            insights['consistency'] = 'REGULAR'
        
        return insights
    
    def analyze_emotional_patterns(self, mood_analysis) -> Dict[str, Any]:
        """Analyze emotional patterns and stability."""
        if not mood_analysis:
            return {'no_data': True}
        
        insights = {
            'emotional_stability': 'EVALUANDO',
            'dominant_emotions': [],
            'concerning_patterns': [],
            'positive_patterns': [],
            'recommendations': []
        }
        
        # Mood distribution analysis
        mood_dist = mood_analysis.get('mood_distribution', {})
        if mood_dist:
            # Sort moods by frequency
            sorted_moods = sorted(mood_dist.items(), key=lambda x: x[1].get('percentage', 0), reverse=True)
            insights['dominant_emotions'] = [
                {
                    'mood': mood,
                    'percentage': data.get('percentage', 0),
                    'intensity': data.get('average_intensity', 0)
                }
                for mood, data in sorted_moods[:3]
            ]
            
            # Analyze emotional balance
            positive_moods = ['joy', 'calm']
            negative_moods = ['depression', 'anxiety', 'anger', 'fear']
            
            positive_percentage = sum(mood_dist.get(mood, {}).get('percentage', 0) for mood in positive_moods)
            negative_percentage = sum(mood_dist.get(mood, {}).get('percentage', 0) for mood in negative_moods)
            
            if positive_percentage > negative_percentage * 1.5:
                insights['emotional_stability'] = 'ESTABLE'
                insights['positive_patterns'].append("Predominio de emociones positivas")
            elif negative_percentage > positive_percentage * 2:
                insights['emotional_stability'] = 'INESTABLE'
                insights['concerning_patterns'].append("Predominio significativo de emociones negativas")
            else:
                insights['emotional_stability'] = 'VARIABLE'
        
        # Temporal patterns
        hourly_patterns = mood_analysis.get('hourly_patterns', {})
        if hourly_patterns:
            # Find problematic time periods
            negative_hours = []
            for hour, moods in hourly_patterns.items():
                negative_count = sum(count for mood, count in moods.items() if mood in ['depression', 'anxiety', 'anger', 'fear'])
                total_count = sum(moods.values())
                if total_count > 0 and negative_count / total_count > 0.7:
                    negative_hours.append(hour)
            
            if negative_hours:
                insights['concerning_patterns'].append(f"Emociones negativas frecuentes en horas: {', '.join(map(str, negative_hours))}")
        
        # Generate recommendations
        if insights['emotional_stability'] == 'INESTABLE':
            insights['recommendations'].extend([
                "Implementar técnicas de regulación emocional",
                "Considerar terapia cognitivo-conductual",
                "Establecer rutinas de autocuidado"
            ])
        elif insights['emotional_stability'] == 'VARIABLE':
            insights['recommendations'].extend([
                "Identificar triggers emocionales",
                "Desarrollar estrategias de afrontamiento",
                "Mantener diario emocional"
            ])
        
        return insights
    
    def analyze_behavioral_patterns(self, chat_analysis, mood_analysis) -> Dict[str, Any]:
        """Analyze behavioral patterns from communication data."""
        insights = {
            'communication_style': {},
            'coping_mechanisms': [],
            'behavioral_changes': [],
            'recommendations': []
        }
        
        # Analyze communication style from chat data
        if chat_analysis:
            common_topics = chat_analysis.get('common_topics', {})
            if common_topics:
                # Categorize topics
                emotional_topics = ['sentir', 'emociones', 'tristeza', 'ansiedad', 'miedo']
                social_topics = ['familia', 'amigos', 'trabajo', 'relaciones']
                coping_topics = ['ayuda', 'terapia', 'medicamento', 'ejercicio', 'meditación']
                
                topic_categories = {
                    'emotional_focus': sum(common_topics.get(topic, 0) for topic in emotional_topics),
                    'social_focus': sum(common_topics.get(topic, 0) for topic in social_topics),
                    'coping_focus': sum(common_topics.get(topic, 0) for topic in coping_topics)
                }
                
                insights['communication_style'] = topic_categories
                
                # Generate insights based on topic focus
                max_category = max(topic_categories.items(), key=lambda x: x[1])
                if max_category[0] == 'emotional_focus':
                    insights['recommendations'].append("Enfoque en procesamiento emocional - continuar explorando sentimientos")
                elif max_category[0] == 'social_focus':
                    insights['recommendations'].append("Enfoque en relaciones sociales - trabajar en habilidades interpersonales")
                elif max_category[0] == 'coping_focus':
                    insights['coping_mechanisms'].append("Búsqueda activa de estrategias de afrontamiento")
        
        return insights
    
    def analyze_therapeutic_progress(self, chat_analysis, mood_analysis) -> Dict[str, Any]:
        """Analyze therapeutic progress indicators."""
        insights = {
            'progress_indicators': [],
            'areas_of_improvement': [],
            'stagnation_areas': [],
            'recommendations': []
        }
        
        # Analyze sentiment trends
        if chat_analysis:
            sentiment_data = chat_analysis.get('sentiment_analysis', {})
            sentiment_trend = sentiment_data.get('sentiment_trend', [])
            
            if len(sentiment_trend) >= 5:
                recent_scores = [entry['score'] for entry in sentiment_trend[-5:]]
                older_scores = [entry['score'] for entry in sentiment_trend[-10:-5]] if len(sentiment_trend) >= 10 else []
                
                if older_scores:
                    recent_avg = statistics.mean(recent_scores)
                    older_avg = statistics.mean(older_scores)
                    
                    if recent_avg > older_avg + 0.1:
                        insights['progress_indicators'].append("Mejora en el sentimiento general de los mensajes")
                    elif recent_avg < older_avg - 0.1:
                        insights['areas_of_improvement'].append("Declive en el sentimiento general - requiere atención")
        
        # Analyze mood stability from mood analysis
        if mood_analysis:
            mood_insights = mood_analysis.get('insights', [])
            for insight in mood_insights:
                if 'estable' in insight.lower():
                    insights['progress_indicators'].append("Estabilidad emocional observada")
                elif 'variable' in insight.lower():
                    insights['areas_of_improvement'].append("Variabilidad emocional - trabajar en regulación")
        
        return insights
    
    def analyze_risk_factors(self, crisis_analysis) -> Dict[str, Any]:
        """Analyze risk factors and protective elements."""
        if not crisis_analysis or crisis_analysis.get('insufficient_data'):
            return {'no_data': True}
        
        insights = {
            'current_risk_level': 'BAJO',
            'risk_factors': [],
            'protective_factors': [],
            'trend_analysis': {},
            'recommendations': []
        }
        
        # Current risk assessment
        avg_risk = crisis_analysis.get('average_recent_risk_score', 0)
        immediate_intervention = crisis_analysis.get('immediate_intervention_required', False)
        
        if immediate_intervention:
            insights['current_risk_level'] = 'CRÍTICO'
        elif avg_risk >= 10:
            insights['current_risk_level'] = 'ALTO'
        elif avg_risk >= 5:
            insights['current_risk_level'] = 'MEDIO'
        
        # Risk trend analysis
        risk_trend = crisis_analysis.get('risk_trend', 'STABLE')
        insights['trend_analysis']['direction'] = risk_trend
        
        if risk_trend == 'ESCALATING':
            insights['risk_factors'].append("Tendencia de escalación en indicadores de riesgo")
            insights['recommendations'].append("Monitoreo intensivo y evaluación profesional urgente")
        elif risk_trend == 'IMPROVING':
            insights['protective_factors'].append("Tendencia de mejora en indicadores de riesgo")
        
        # Escalation patterns
        escalation_patterns = crisis_analysis.get('escalation_patterns', {})
        for pattern_name, pattern_data in escalation_patterns.items():
            if isinstance(pattern_data, dict) and pattern_data.get('detected'):
                insights['risk_factors'].append(f"Patrón de escalación detectado: {pattern_name}")
        
        return insights
    
    def generate_actionable_recommendations(self, chat_analysis, mood_analysis, crisis_analysis) -> List[Dict[str, Any]]:
        """Generate prioritized, actionable recommendations."""
        recommendations = []
        
        # Crisis-level recommendations (highest priority)
        if crisis_analysis and not crisis_analysis.get('insufficient_data'):
            if crisis_analysis.get('immediate_intervention_required'):
                recommendations.append({
                    'priority': 'CRÍTICA',
                    'category': 'Intervención de Crisis',
                    'action': 'Contactar servicios de emergencia inmediatamente',
                    'timeline': 'INMEDIATO',
                    'responsible': 'Equipo de crisis/Emergencias'
                })
            
            avg_risk = crisis_analysis.get('average_recent_risk_score', 0)
            if avg_risk >= 10:
                recommendations.append({
                    'priority': 'ALTA',
                    'category': 'Evaluación de Riesgo',
                    'action': 'Programar evaluación psiquiátrica urgente',
                    'timeline': '24-48 horas',
                    'responsible': 'Psiquiatra/Psicólogo clínico'
                })
        
        # Mood-based recommendations
        if mood_analysis:
            mood_dist = mood_analysis.get('mood_distribution', {})
            negative_moods = ['depression', 'anxiety', 'anger', 'fear']
            negative_percentage = sum(
                mood_dist.get(mood, {}).get('percentage', 0) 
                for mood in negative_moods
            )
            
            if negative_percentage > 60:
                recommendations.append({
                    'priority': 'ALTA',
                    'category': 'Regulación Emocional',
                    'action': 'Implementar terapia cognitivo-conductual para manejo emocional',
                    'timeline': '1-2 semanas',
                    'responsible': 'Psicólogo clínico'
                })
        
        # Engagement-based recommendations
        if chat_analysis:
            total_messages = chat_analysis.get('user_messages', 0)
            if total_messages < 10:
                recommendations.append({
                    'priority': 'MEDIA',
                    'category': 'Engagement',
                    'action': 'Implementar estrategias para aumentar participación del usuario',
                    'timeline': '1 semana',
                    'responsible': 'Terapeuta principal'
                })
            
            # Sentiment-based recommendations
            sentiment_data = chat_analysis.get('sentiment_analysis', {})
            avg_sentiment = sentiment_data.get('average_sentiment', 0)
            
            if avg_sentiment < -0.3:
                recommendations.append({
                    'priority': 'MEDIA',
                    'category': 'Bienestar Emocional',
                    'action': 'Incorporar técnicas de mindfulness y gratitud',
                    'timeline': '2-3 semanas',
                    'responsible': 'Terapeuta/Coach de bienestar'
                })
        
        # General wellness recommendations
        recommendations.append({
            'priority': 'BAJA',
            'category': 'Prevención',
            'action': 'Establecer rutina de autocuidado y actividades placenteras',
            'timeline': 'Continuo',
            'responsible': 'Usuario con apoyo del terapeuta'
        })
        
        # Sort by priority
        priority_order = {'CRÍTICA': 0, 'ALTA': 1, 'MEDIA': 2, 'BAJA': 3}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 4))
        
        return recommendations

def load_analysis_results() -> Tuple[Dict, Dict, Dict]:
    """Load existing analysis results from files."""
    chat_analysis = {}
    mood_analysis = {}
    crisis_analysis = {}
    
    try:
        if os.path.exists('chat_analysis_results.json'):
            with open('chat_analysis_results.json', 'r', encoding='utf-8') as f:
                chat_analysis = json.load(f)
    except Exception as e:
        print(f"Error loading chat analysis: {e}")
    
    try:
        if os.path.exists('mood_analysis_results.json'):
            with open('mood_analysis_results.json', 'r', encoding='utf-8') as f:
                mood_analysis = json.load(f)
    except Exception as e:
        print(f"Error loading mood analysis: {e}")
    
    try:
        if os.path.exists('crisis_detection_results.json'):
            with open('crisis_detection_results.json', 'r', encoding='utf-8') as f:
                crisis_data = json.load(f)
                crisis_analysis = crisis_data.get('conversation_analysis', {})
    except Exception as e:
        print(f"Error loading crisis analysis: {e}")
    
    return chat_analysis, mood_analysis, crisis_analysis

def main():
    """Main function to generate comprehensive insights."""
    print("💡 Generando insights comprehensivos...")
    
    # Load existing analysis results
    chat_analysis, mood_analysis, crisis_analysis = load_analysis_results()
    
    # Initialize insight generator
    generator = InsightGenerator()
    
    # Generate comprehensive insights
    insights = generator.generate_comprehensive_insights(
        chat_analysis=chat_analysis,
        mood_analysis=mood_analysis,
        crisis_analysis=crisis_analysis
    )
    
    # Display results
    print("\n📊 INSIGHTS COMPREHENSIVOS:")
    print("=" * 60)
    
    # Executive Summary
    summary = insights.get('summary', {})
    print(f"\n🎯 RESUMEN EJECUTIVO:")
    print(f"  Estado general: {summary.get('overall_status', 'N/A')}")
    
    key_findings = summary.get('key_findings', [])
    if key_findings:
        print(f"  Hallazgos clave:")
        for finding in key_findings:
            print(f"    • {finding}")
    
    concerns = summary.get('concerns', [])
    if concerns:
        print(f"  Áreas de preocupación:")
        for concern in concerns:
            print(f"    ⚠️ {concern}")
    
    positive_indicators = summary.get('positive_indicators', [])
    if positive_indicators:
        print(f"  Indicadores positivos:")
        for indicator in positive_indicators:
            print(f"    ✅ {indicator}")
    
    # Risk Analysis
    risk_insights = insights.get('risk 
            print(f"    ✅ {indicator}")
    
    # Risk Analysis
    risk_insights = insights.get('risk_insights', {})
    if not risk_insights.get('no_data'):
        print(f"\n🚨 ANÁLISIS DE RIESGOS:")
        print(f"  Nivel de riesgo actual: {risk_insights.get('current_risk_level', 'N/A')}")
        
        risk_factors = risk_insights.get('risk_factors', [])
        if risk_factors:
            print(f"  Factores de riesgo:")
            for factor in risk_factors:
                print(f"    🔴 {factor}")
        
        protective_factors = risk_insights.get('protective_factors', [])
        if protective_factors:
            print(f"  Factores protectores:")
            for factor in protective_factors:
                print(f"    🛡️ {factor}")
    
    # Engagement Analysis
    engagement_insights = insights.get('engagement_insights', {})
    if not engagement_insights.get('no_data'):
        print(f"\n📈 ANÁLISIS DE PARTICIPACIÓN:")
        print(f"  Nivel de actividad: {engagement_insights.get('activity_level', 'N/A')}")
        print(f"  Consistencia: {engagement_insights.get('consistency', 'N/A')}")
    
    # Emotional Analysis
    emotional_insights = insights.get('emotional_insights', {})
    if not emotional_insights.get('no_data'):
        print(f"\n😊 ANÁLISIS EMOCIONAL:")
        print(f"  Estabilidad emocional: {emotional_insights.get('emotional_stability', 'N/A')}")
        
        dominant_emotions = emotional_insights.get('dominant_emotions', [])
        if dominant_emotions:
            print(f"  Emociones dominantes:")
            for emotion in dominant_emotions[:3]:
                print(f"    • {emotion['mood'].title()}: {emotion['percentage']:.1f}%")
    
    # Recommendations
    recommendations = insights.get('recommendations', [])
    if recommendations:
        print(f"\n💡 RECOMENDACIONES PRIORIZADAS:")
        for i, rec in enumerate(recommendations[:5], 1):
            priority_emoji = {
                'CRÍTICA': '🚨',
                'ALTA': '⚠️',
                'MEDIA': '📋',
                'BAJA': '💡'
            }.get(rec['priority'], '📝')
            
            print(f"  {i}. {priority_emoji} [{rec['priority']}] {rec['category']}")
            print(f"     Acción: {rec['action']}")
            print(f"     Plazo: {rec['timeline']}")
            print(f"     Responsable: {rec['responsible']}")
            print()
    
    # Save comprehensive insights
    output_file = 'comprehensive_insights.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Insights comprehensivos generados y guardados en: {output_file}")
    
    # Generate summary report
    generate_summary_report(insights)

def generate_summary_report(insights: Dict[str, Any]) -> None:
    """Generate a human-readable summary report."""
    report_file = 'mental_health_report.txt'
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("REPORTE DE SALUD MENTAL - PLATAFORMA ANA\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Fecha de generación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # Executive Summary
        summary = insights.get('summary', {})
        f.write("RESUMEN EJECUTIVO\n")
        f.write("-" * 20 + "\n")
        f.write(f"Estado General: {summary.get('overall_status', 'N/A')}\n\n")
        
        # Key findings
        key_findings = summary.get('key_findings', [])
        if key_findings:
            f.write("Hallazgos Principales:\n")
            for finding in key_findings:
                f.write(f"• {finding}\n")
            f.write("\n")
        
        # Concerns
        concerns = summary.get('concerns', [])
        if concerns:
            f.write("Áreas de Preocupación:\n")
            for concern in concerns:
                f.write(f"⚠️ {concern}\n")
            f.write("\n")
        
        # Positive indicators
        positive_indicators = summary.get('positive_indicators', [])
        if positive_indicators:
            f.write("Indicadores Positivos:\n")
            for indicator in positive_indicators:
                f.write(f"✅ {indicator}\n")
            f.write("\n")
        
        # Recommendations
        recommendations = insights.get('recommendations', [])
        if recommendations:
            f.write("RECOMENDACIONES PRIORITARIAS\n")
            f.write("-" * 30 + "\n")
            for i, rec in enumerate(recommendations[:5], 1):
                f.write(f"{i}. [{rec['priority']}] {rec['category']}\n")
                f.write(f"   Acción: {rec['action']}\n")
                f.write(f"   Plazo: {rec['timeline']}\n")
                f.write(f"   Responsable: {rec['responsible']}\n\n")
    
    print(f"📄 Reporte de resumen generado: {report_file}")

if __name__ == "__main__":
    main()
