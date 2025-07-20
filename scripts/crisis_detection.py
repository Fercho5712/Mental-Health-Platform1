import re
import json
import numpy as np
from datetime import datetime, timedelta
from textblob import TextBlob
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest
import warnings
from typing import Dict, List, Any, Tuple
from collections import defaultdict
warnings.filterwarnings('ignore')

class CrisisDetectionSystem:
    def __init__(self):
        # Crisis keywords in Spanish
        self.crisis_keywords = {
            'suicide_direct': {
                'keywords': ['suicidio', 'suicidarme', 'quitarme la vida', 'acabar conmigo', 'matarme'],
                'weight': 10,
                'severity': 'CRÍTICO'
            },
            'suicide_indirect': {
                'keywords': ['no quiero vivir', 'mejor muerto', 'sin mí estarían mejor', 'no vale la pena vivir'],
                'weight': 8,
                'severity': 'ALTO'
            },
            'self_harm': {
                'keywords': ['cortarme', 'lastimarme', 'hacerme daño', 'autolesión', 'herirme'],
                'weight': 7,
                'severity': 'ALTO'
            },
            'hopelessness': {
                'keywords': ['sin esperanza', 'no hay salida', 'todo está perdido', 'no puedo más', 'es inútil'],
                'weight': 6,
                'severity': 'MEDIO'
            },
            'isolation': {
                'keywords': ['completamente solo', 'nadie me entiende', 'todos me abandonan', 'aislado'],
                'weight': 4,
                'severity': 'MEDIO'
            },
            'desperation': {
                'keywords': ['desesperado', 'no aguanto', 'es insoportable', 'no puedo seguir'],
                'weight': 5,
                'severity': 'MEDIO'
            }
        }
        
        # Protective factors
        self.protective_factors = {
            'support': ['familia', 'amigos', 'apoyo', 'ayuda', 'acompañado'],
            'coping': ['respirar', 'meditar', 'ejercicio', 'música', 'escribir'],
            'hope': ['esperanza', 'futuro', 'mañana', 'mejorar', 'cambiar'],
            'professional': ['psicólogo', 'terapeuta', 'doctor', 'medicamento', 'tratamiento']
        }
        
        # Crisis escalation patterns
        self.escalation_patterns = [
            'increasing_frequency',  # More crisis messages over time
            'increasing_severity',   # More severe language over time
            'persistent_themes',     # Same crisis themes repeatedly
            'declining_protective'   # Fewer protective factors mentioned
        ]
        
        # Initialize anomaly detector
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        
    def analyze_text_for_crisis(self, text):
        """Analyze text for crisis indicators"""
        text_lower = text.lower()
        
        # Remove punctuation and normalize
        text_clean = re.sub(r'[^\w\s]', ' ', text_lower)
        
        crisis_scores = {}
        total_crisis_score = 0
        indicators_found = []
        
        # Check each crisis category
        for category, data in self.crisis_keywords.items():
            category_score = 0
            category_indicators = []
            
            for keyword in data['keywords']:
                if keyword in text_clean:
                    category_score += data['weight']
                    category_indicators.append({
                        'category': category,
                        'keyword': keyword,
                        'weight': data['weight'],
                        'severity': data['severity']
                    })
                    indicators_found.append(f"{category}: {keyword}")
            
            # Normalize by text length and apply severity weight
            if category_score > 0:
                normalized_score = (category_score / len(text.split())) * data['weight']
                crisis_scores[category] = normalized_score
                total_crisis_score += normalized_score
            else:
                crisis_scores[category] = 0
        
        # Check for protective factors
        protective_score = 0
        protective_found = []
        for category, keywords in self.protective_factors.items():
            for keyword in keywords:
                if keyword in text_clean:
                    protective_score += 1
                    protective_found.append({
                        'category': category,
                        'keyword': keyword
                    })
        
        # Sentiment analysis
        blob = TextBlob(text)
        sentiment_polarity = blob.sentiment.polarity
        
        # Calculate final risk score
        risk_score = total_crisis_score - (protective_score * 1) + abs(min(0, sentiment_polarity))
        
        # Determine risk level
        if risk_score >= 15:
            risk_level = 'CRÍTICO'
        elif risk_score >= 10:
            risk_level = 'ALTO'
        elif risk_score >= 5:
            risk_level = 'MEDIO'
        else:
            risk_level = 'BAJO'
        
        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'crisis_scores': crisis_scores,
            'indicators_found': indicators_found,
            'protective_factors': protective_found,
            'sentiment_polarity': sentiment_polarity,
            'requires_immediate_attention': risk_score >= 15
        }
    
    def analyze_conversation_patterns(self, messages):
        """Analyze conversation patterns for crisis indicators"""
        user_messages = [msg for msg in messages if msg.get('sender') == 'user']
        
        if len(user_messages) < 2:
            return {'insufficient_data': True}
        
        # Analyze each message
        message_analyses = []
        for msg in user_messages:
            try:
                timestamp = datetime.fromisoformat(msg.get('timestamp', '').replace('Z', '+00:00'))
                analysis = self.analyze_text_for_crisis(msg.get('content', ''))
                analysis['timestamp'] = timestamp
                analysis['message_id'] = msg.get('id', '')
                message_analyses.append(analysis)
            except Exception as e:
                print(f"Error analyzing message: {e}")
                continue
        
        # Sort by timestamp
        message_analyses.sort(key=lambda x: x['timestamp'])
        
        # Detect patterns
        patterns = self.detect_escalation_patterns(message_analyses)
        
        # Calculate overall risk assessment
        recent_messages = message_analyses[-5:]  # Last 5 messages
        avg_recent_score = sum(msg['risk_score'] for msg in recent_messages) / len(recent_messages)
        
        highest_risk_message = max(message_analyses, key=lambda x: x['risk_score'])
        
        # Check for immediate intervention needs
        immediate_intervention = any(msg['requires_immediate_attention'] for msg in recent_messages)
        
        return {
            'total_messages_analyzed': len(message_analyses),
            'average_recent_risk_score': avg_recent_score,
            'highest_risk_score': highest_risk_message['risk_score'],
            'highest_risk_message': {
                'content': highest_risk_message['content'][:100] + '...',
                'timestamp': highest_risk_message['timestamp'].isoformat(),
                'score': highest_risk_message['risk_score']
            },
            'escalation_patterns': patterns,
            'immediate_intervention_required': immediate_intervention,
            'risk_trend': self.calculate_risk_trend(message_analyses),
            'recommendations': self.generate_recommendations(message_analyses, patterns)
        }
    
    def detect_escalation_patterns(self, analyses):
        """Detect crisis escalation patterns"""
        if len(analyses) < 3:
            return {}
        
        patterns = {}
        
        # Check frequency escalation (more crisis messages over time)
        recent_period = analyses[-7:]  # Last 7 messages
        older_period = analyses[-14:-7] if len(analyses) >= 14 else analyses[:-7]
        
        if older_period:
            recent_crisis_rate = sum(1 for msg in recent_period if msg['risk_score'] >= 5) / len(recent_period)
            older_crisis_rate = sum(1 for msg in older_period if msg['risk_score'] >= 5) / len(older_period)
            
            patterns['frequency_escalation'] = {
                'detected': recent_crisis_rate > older_crisis_rate * 1.5,
                'recent_rate': recent_crisis_rate,
                'older_rate': older_crisis_rate
            }
        
        # Check severity escalation
        recent_scores = [msg['risk_score'] for msg in analyses[-5:]]
        older_scores = [msg['risk_score'] for msg in analyses[-10:-5]] if len(analyses) >= 10 else []
        
        if older_scores:
            patterns['severity_escalation'] = {
                'detected': sum(recent_scores) / len(recent_scores) > sum(older_scores) / len(older_scores) * 1.3,
                'recent_avg': sum(recent_scores) / len(recent_scores),
                'older_avg': sum(older_scores) / len(older_scores)
            }
        
        # Check for persistent themes
        crisis_categories = defaultdict(int)
        for analysis in analyses[-10:]:  # Last 10 messages
            for indicator in analysis.get('indicators_found', []):
                crisis_categories[indicator.split(':')[0]] += 1
        
        persistent_themes = [cat for cat, count in crisis_categories.items() if count >= 3]
        patterns['persistent_themes'] = {
            'detected': len(persistent_themes) > 0,
            'themes': persistent_themes
        }
        
        return patterns

    def calculate_risk_trend(self, analyses):
        """Calculate the overall risk trend."""
        if len(analyses) < 3:
            return 'INSUFFICIENT_DATA'
        
        recent_scores = [msg['risk_score'] for msg in analyses[-3:]]
        older_scores = [msg['risk_score'] for msg in analyses[-6:-3]] if len(analyses) >= 6 else [0]
        
        recent_avg = sum(recent_scores) / len(recent_scores)
        older_avg = sum(older_scores) / len(older_scores)
        
        if recent_avg > older_avg * 1.5:
            return 'ESCALATING'
        elif recent_avg < older_avg * 0.7:
            return 'IMPROVING'
        else:
            return 'STABLE'

    def generate_recommendations(self, analyses, patterns):
        """Generate intervention recommendations based on analysis."""
        recommendations = []
        
        # Check latest message risk
        if analyses:
            latest = analyses[-1]
            if latest['risk_score'] >= 15:
                recommendations.append("🚨 INTERVENCIÓN INMEDIATA: Contactar servicios de emergencia o línea de crisis")
                recommendations.append("📞 Proporcionar números de emergencia: 911 o línea nacional de prevención del suicidio")
            elif latest['risk_score'] >= 10:
                recommendations.append("⚠️ RIESGO ALTO: Programar sesión urgente con profesional de salud mental")
                recommendations.append("👥 Activar red de apoyo familiar/social")
        
        # Pattern-based recommendations
        if patterns.get('frequency_escalation', {}).get('detected'):
            recommendations.append("📈 Patrón de escalación detectado: Aumentar frecuencia de monitoreo")
        
        if patterns.get('persistent_themes', {}).get('detected'):
            themes = patterns['persistent_themes']['themes']
            recommendations.append(f"🔄 Temas persistentes detectados ({', '.join(themes)}): Enfocar terapia en estos aspectos")
        
        # General recommendations
        protective_factors_count = sum(len(msg.get('protective_factors', [])) for msg in analyses[-5:])
        if protective_factors_count < 2:
            recommendations.append("🛡️ Fortalecer factores protectores: Identificar y desarrollar estrategias de afrontamiento")
        
        return recommendations
    
    def detect_anomalies(self, user_data):
        """Detect anomalous patterns that might indicate crisis"""
        if len(user_data) < 5:  # Need minimum data points
            return {'anomalies_detected': False, 'reason': 'insufficient_data'}
        
        # Prepare features for anomaly detection
        features = []
        for data_point in user_data:
            feature_vector = [
                data_point.get('risk_score', 0),
                data_point.get('sentiment_polarity', 0),
                len(data_point.get('indicators_found', [])),
                len(data_point.get('protective_factors', []))
            ]
            features.append(feature_vector)
        
        features_array = np.array(features)
        
        # Fit anomaly detector
        anomaly_predictions = self.anomaly_detector.fit_predict(features_array)
        anomaly_scores = self.anomaly_detector.decision_function(features_array)
        
        # Identify anomalies
        anomalies = []
        for i, (prediction, score) in enumerate(zip(anomaly_predictions, anomaly_scores)):
            if prediction == -1:  # Anomaly detected
                anomalies.append({
                    'index': i,
                    'anomaly_score': score,
                    'data_point': user_data[i]
                })
        
        return {
            'anomalies_detected': len(anomalies) > 0,
            'anomaly_count': len(anomalies),
            'anomalies': anomalies,
            'overall_anomaly_score': np.mean(anomaly_scores)
        }
    
    def generate_crisis_alert(self, analysis_result):
        """Generate crisis alert with recommendations"""
        risk_level = analysis_result.get('risk_level', 'low')
        risk_score = analysis_result.get('risk_score', 0)
        
        alert = {
            'timestamp': datetime.now().isoformat(),
            'risk_level': risk_level,
            'risk_score': risk_score,
            'requires_immediate_attention': analysis_result.get('requires_immediate_attention', False)
        }
        
        # Generate specific recommendations based on risk level
        if risk_level == 'CRÍTICO':
            alert['recommendations'] = [
                'Contactar inmediatamente a servicios de emergencia',
                'Notificar al terapeuta asignado',
                'Activar protocolo de crisis',
                'Considerar intervención presencial inmediata'
            ]
            alert['emergency_contacts'] = [
                'Línea Nacional de Prevención del Suicidio: 988',
                'Emergencias: 911',
                'Crisis Text Line: Envía HOLA al 741741'
            ]
        elif risk_level == 'ALTO':
            alert['recommendations'] = [
                'Programar cita urgente con terapeuta',
                'Aumentar frecuencia de seguimiento',
                'Activar red de apoyo familiar/social',
                'Considerar ajuste en plan de tratamiento'
            ]
        elif risk_level == 'MEDIO':
            alert['recommendations'] = [
                'Programar seguimiento en 24-48 horas',
                'Ofrecer recursos de autoayuda',
                'Monitorear más de cerca',
                'Sugerir técnicas de afrontamiento'
            ]
        else:
            alert['recommendations'] = [
                'Continuar con seguimiento regular',
                'Reforzar factores protectores',
                'Mantener comunicación abierta'
            ]
        
        return alert
    
    def comprehensive_crisis_assessment(self, user_id, messages, user_profile=None):
        """Perform comprehensive crisis assessment"""
        print(f"Realizando evaluación de crisis para usuario {user_id}...")
        
        # Analyze conversation patterns
        conversation_analysis = self.analyze_conversation_patterns(messages)
        
        # Detect anomalies if we have enough data
        anomaly_analysis = {}
        if conversation_analysis.get('message_analyses'):
            anomaly_analysis = self.detect_anomalies(conversation_analysis['message_analyses'])
        
        # Generate overall assessment
        overall_risk_score = conversation_analysis.get('average_recent_risk_score', 0)
        max_risk_score = conversation_analysis.get('highest_risk_score', 0)
        escalation_detected = any(pattern.get('detected') for pattern in conversation_analysis.get('escalation_patterns', {}).values())
        
        # Determine final risk level
        if max_risk_score >= 15 or escalation_detected:
            final_risk_level = 'CRÍTICO'
        elif max_risk_score >= 10 or overall_risk_score >= 10:
            final_risk_level = 'ALTO'
        elif max_risk_score >= 5 or overall_risk_score >= 5:
            final_risk_level = 'MEDIO'
        else:
            final_risk_level = 'BAJO'
        
        # Create comprehensive assessment
        assessment = {
            'user_id': user_id,
            'assessment_timestamp': datetime.now().isoformat(),
            'final_risk_level': final_risk_level,
            'overall_risk_score': overall_risk_score,
            'max_risk_score': max_risk_score,
            'conversation_analysis': conversation_analysis,
            'anomaly_analysis': anomaly_analysis,
            'escalation_detected': escalation_detected
        }
        
        # Generate crisis alert if needed
        if final_risk_level in ['CRÍTICO', 'ALTO']:
            crisis_alert = self.generate_crisis_alert({
                'risk_level': final_risk_level,
                'risk_score': max_risk_score,
                'requires_immediate_attention': final_risk_level == 'CRÍTICO'
            })
            assessment['crisis_alert'] = crisis_alert
        
        # Save assessment
        output_file = f'crisis_assessment_user_{user_id}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(assessment, f, ensure_ascii=False, indent=2, default=str)
        
        # Print summary
        self._print_assessment_summary(assessment)
        
        return assessment
    
    def _print_assessment_summary(self, assessment):
        """Print crisis assessment summary"""
        print("\n" + "="*60)
        print("EVALUACIÓN DE CRISIS - RESUMEN")
        print("="*60)
        
        print(f"Usuario: {assessment['user_id']}")
        print(f"Nivel de riesgo final: {assessment['final_risk_level'].upper()}")
        print(f"Puntuación de riesgo general: {assessment['overall_risk_score']:.3f}")
        print(f"Puntuación de riesgo máxima: {assessment['max_risk_score']:.3f}")
        print(f"Escalación detectada: {'Sí' if assessment['escalation_detected'] else 'No'}")
        
        if 'crisis_alert' in assessment:
            print(f"\n🚨 ALERTA DE CRISIS ACTIVADA 🚨")
            print("Recomendaciones:")
            for rec in assessment['crisis_alert']['recommendations']:
                print(f"- {rec}")
            
            if 'emergency_contacts' in assessment['crisis_alert']:
                print("\nContactos de emergencia:")
                for contact in assessment['crisis_alert']['emergency_contacts']:
                    print(f"- {contact}")
        
        conv_analysis = assessment.get('conversation_analysis', {})
        if conv_analysis:
            print(f"\nMensajes analizados: {conv_analysis.get('total_messages_analyzed', 0)}")
            print(f"Frecuencia de crisis: {conv_analysis.get('average_recent_risk_score', 0):.2%}")
            print(f"Mensajería rápida detectada: {'Sí' if conv_analysis.get('rapid_messaging') else 'No'}")

# Demo function
def run_crisis_detection_demo():
    """Run crisis detection with demo data"""
    detector = CrisisDetectionSystem()
    
    # Demo messages with varying crisis levels
    demo_messages = [
        {
            'id': '1',
            'content': 'Hola Ana, me siento un poco triste hoy.',
            'sender': 'user',
            'timestamp': '2024-01-15T10:30:00Z'
        },
        {
            'id': '2',
            'content': 'No puedo más con esta situación. Todo parece sin esperanza.',
            'sender': 'user',
            'timestamp': '2024-01-15T11:15:00Z'
        },
        {
            'id': '3',
            'content': 'A veces pienso que sería mejor desaparecer. Nadie me entiende.',
            'sender': 'user',
            'timestamp': '2024-01-15T11:45:00Z'
        },
        {
            'id': '4',
            'content': 'He estado pensando en hacerme daño. El dolor es insoportable.',
            'sender': 'user',
            'timestamp': '2024-01-15T12:30:00Z'
        },
        {
            'id': '5',
            'content': 'Hablé con mi familia y me siento un poco mejor, voy a buscar ayuda profesional.',
            'sender': 'user',
            'timestamp': '2024-01-16T18:00:00Z'
        }
    ]
    
    # Run comprehensive assessment
    assessment = detector.comprehensive_crisis_assessment(
        user_id=1,
        messages=demo_messages
    )
    
    return assessment

if __name__ == "__main__":
    print("Iniciando sistema de detección de crisis...")
    assessment = run_crisis_detection_demo()
    print("\nEvaluación de crisis completada.")
