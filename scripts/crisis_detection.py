import re
import json
import numpy as np
from datetime import datetime, timedelta
from textblob import TextBlob
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest
import warnings
warnings.filterwarnings('ignore')

class CrisisDetectionSystem:
    def __init__(self):
        # Crisis keywords in Spanish
        self.crisis_keywords = {
            'suicide': [
                'suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 
                'acabar con todo', 'no quiero vivir', 'mejor muerto',
                'terminar con mi vida', 'no vale la pena vivir'
            ],
            'self_harm': [
                'cortarme', 'lastimarme', 'hacerme daño', 'autolesión',
                'herirme', 'golpearme', 'castigarme físicamente'
            ],
            'hopelessness': [
                'sin esperanza', 'no hay salida', 'todo está perdido',
                'no puedo más', 'es inútil', 'nunca mejorará',
                'no tiene sentido', 'estoy perdido', 'sin futuro'
            ],
            'isolation': [
                'nadie me entiende', 'estoy solo', 'nadie me quiere',
                'todos me odian', 'mejor desaparecer', 'invisible',
                'no le importo a nadie', 'completamente solo'
            ],
            'overwhelming_pain': [
                'dolor insoportable', 'no aguanto más', 'demasiado dolor',
                'sufrimiento extremo', 'agonía', 'tortura emocional',
                'dolor que no para', 'insoportable'
            ]
        }
        
        # Severity weights for different categories
        self.severity_weights = {
            'suicide': 1.0,
            'self_harm': 0.8,
            'hopelessness': 0.6,
            'isolation': 0.4,
            'overwhelming_pain': 0.7
        }
        
        # Protective factors
        self.protective_factors = [
            'familia', 'amigos', 'terapia', 'medicación', 'esperanza',
            'futuro', 'metas', 'sueños', 'ayuda', 'apoyo', 'amor',
            'razones para vivir', 'cosas buenas', 'mejorar'
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
        for category, keywords in self.crisis_keywords.items():
            category_score = 0
            category_indicators = []
            
            for keyword in keywords:
                if keyword in text_clean:
                    category_score += 1
                    category_indicators.append(keyword)
                    indicators_found.append(f"{category}: {keyword}")
            
            # Normalize by text length and apply severity weight
            if category_score > 0:
                normalized_score = (category_score / len(text.split())) * self.severity_weights[category]
                crisis_scores[category] = normalized_score
                total_crisis_score += normalized_score
            else:
                crisis_scores[category] = 0
        
        # Check for protective factors
        protective_score = 0
        protective_found = []
        for factor in self.protective_factors:
            if factor in text_clean:
                protective_score += 1
                protective_found.append(factor)
        
        # Sentiment analysis
        blob = TextBlob(text)
        sentiment_polarity = blob.sentiment.polarity
        
        # Calculate final risk score
        risk_score = total_crisis_score - (protective_score * 0.1) + abs(min(0, sentiment_polarity))
        
        # Determine risk level
        if risk_score >= 0.8:
            risk_level = 'critical'
        elif risk_score >= 0.5:
            risk_level = 'high'
        elif risk_score >= 0.2:
            risk_level = 'moderate'
        else:
            risk_level = 'low'
        
        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'crisis_scores': crisis_scores,
            'indicators_found': indicators_found,
            'protective_factors': protective_found,
            'sentiment_polarity': sentiment_polarity,
            'requires_immediate_attention': risk_score >= 0.5
        }
    
    def analyze_conversation_patterns(self, messages):
        """Analyze conversation patterns for crisis indicators"""
        if not messages:
            return {}
        
        user_messages = [msg for msg in messages if msg.get('sender') == 'user']
        
        if not user_messages:
            return {}
        
        # Analyze each message
        message_analyses = []
        for msg in user_messages:
            analysis = self.analyze_text_for_crisis(msg['content'])
            analysis['timestamp'] = msg['timestamp']
            analysis['message_id'] = msg.get('id', '')
            message_analyses.append(analysis)
        
        # Calculate pattern indicators
        recent_messages = message_analyses[-5:]  # Last 5 messages
        
        # Escalation detection
        risk_scores = [analysis['risk_score'] for analysis in message_analyses]
        recent_risk_scores = [analysis['risk_score'] for analysis in recent_messages]
        
        escalation_detected = False
        if len(recent_risk_scores) >= 3:
            # Check if risk is increasing
            trend = np.polyfit(range(len(recent_risk_scores)), recent_risk_scores, 1)[0]
            escalation_detected = trend > 0.1
        
        # Frequency of crisis indicators
        crisis_frequency = sum(1 for analysis in message_analyses if analysis['risk_score'] > 0.2) / len(message_analyses)
        
        # Time-based patterns
        timestamps = [datetime.fromisoformat(msg['timestamp'].replace('Z', '+00:00')) for msg in user_messages]
        if len(timestamps) > 1:
            time_diffs = [(timestamps[i] - timestamps[i-1]).total_seconds() / 3600 for i in range(1, len(timestamps))]
            avg_time_between = np.mean(time_diffs)
            
            # Rapid messaging might indicate crisis
            rapid_messaging = avg_time_between < 1  # Less than 1 hour between messages
        else:
            rapid_messaging = False
            avg_time_between = 0
        
        return {
            'message_analyses': message_analyses,
            'overall_risk_score': np.mean(risk_scores),
            'max_risk_score': np.max(risk_scores),
            'recent_risk_trend': np.mean(recent_risk_scores),
            'escalation_detected': escalation_detected,
            'crisis_frequency': crisis_frequency,
            'rapid_messaging': rapid_messaging,
            'avg_time_between_messages': avg_time_between,
            'total_messages_analyzed': len(message_analyses)
        }
    
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
        if risk_level == 'critical':
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
        elif risk_level == 'high':
            alert['recommendations'] = [
                'Programar cita urgente con terapeuta',
                'Aumentar frecuencia de seguimiento',
                'Activar red de apoyo familiar/social',
                'Considerar ajuste en plan de tratamiento'
            ]
        elif risk_level == 'moderate':
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
        overall_risk_score = conversation_analysis.get('overall_risk_score', 0)
        max_risk_score = conversation_analysis.get('max_risk_score', 0)
        escalation_detected = conversation_analysis.get('escalation_detected', False)
        
        # Determine final risk level
        if max_risk_score >= 0.8 or escalation_detected:
            final_risk_level = 'critical'
        elif max_risk_score >= 0.5 or overall_risk_score >= 0.4:
            final_risk_level = 'high'
        elif max_risk_score >= 0.2 or overall_risk_score >= 0.15:
            final_risk_level = 'moderate'
        else:
            final_risk_level = 'low'
        
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
        if final_risk_level in ['critical', 'high']:
            crisis_alert = self.generate_crisis_alert({
                'risk_level': final_risk_level,
                'risk_score': max_risk_score,
                'requires_immediate_attention': final_risk_level == 'critical'
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
            print(f"Frecuencia de crisis: {conv_analysis.get('crisis_frequency', 0):.2%}")
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
