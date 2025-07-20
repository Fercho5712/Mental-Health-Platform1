import os
import sys
import json
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob
import re
from collections import defaultdict, Counter
import warnings
import statistics
warnings.filterwarnings('ignore')

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class MentalHealthAnalyzer:
    def __init__(self):
        self.mood_keywords = {
            'positive': ['feliz', 'alegre', 'contento', 'bien', 'genial', 'excelente', 'optimista', 'tranquilo', 'relajado'],
            'negative': ['triste', 'deprimido', 'ansiedad', 'preocupado', 'miedo', 'angustia', 'mal', 'terrible', 'desesperado'],
            'neutral': ['normal', 'regular', 'ok', 'igual', 'así', 'común']
        }
        
        self.crisis_indicators = [
            'suicidio', 'matarme', 'no quiero vivir', 'acabar con todo', 
            'lastimar', 'dolor insoportable', 'no puedo más', 'sin esperanza'
        ]
        
    def analyze_sentiment(self, text):
        """Analyze sentiment using TextBlob and custom keywords"""
        # TextBlob sentiment analysis
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        # Custom keyword analysis
        text_lower = text.lower()
        positive_count = sum(1 for word in self.mood_keywords['positive'] if word in text_lower)
        negative_count = sum(1 for word in self.mood_keywords['negative'] if word in text_lower)
        
        # Combine scores
        keyword_score = (positive_count - negative_count) / max(len(text.split()), 1)
        combined_score = (polarity + keyword_score) / 2
        
        return {
            'polarity': polarity,
            'keyword_score': keyword_score,
            'combined_score': combined_score,
            'sentiment': 'positive' if combined_score > 0.1 else 'negative' if combined_score < -0.1 else 'neutral'
        }
    
    def detect_crisis_indicators(self, text):
        """Detect potential crisis indicators in text"""
        text_lower = text.lower()
        indicators_found = [indicator for indicator in self.crisis_indicators if indicator in text_lower]
        return {
            'has_crisis_indicators': len(indicators_found) > 0,
            'indicators_found': indicators_found,
            'crisis_score': len(indicators_found) / len(self.crisis_indicators)
        }
    
    def analyze_conversation_patterns(self, messages):
        """Analyze patterns in conversation data"""
        if not messages:
            return {}
            
        df = pd.DataFrame(messages)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.day_name()
        
        # Analyze user messages only
        user_messages = df[df['sender'] == 'user']
        
        patterns = {
            'total_messages': len(user_messages),
            'avg_message_length': user_messages['content'].str.len().mean(),
            'most_active_hours': user_messages['hour'].value_counts().head(3).to_dict(),
            'most_active_days': user_messages['day_of_week'].value_counts().head(3).to_dict(),
            'conversation_frequency': self._calculate_frequency(user_messages['timestamp'])
        }
        
        return patterns
    
    def _calculate_frequency(self, timestamps):
        """Calculate conversation frequency patterns"""
        if len(timestamps) < 2:
            return {'avg_days_between': 0, 'frequency_pattern': 'insufficient_data'}
            
        timestamps_sorted = timestamps.sort_values()
        time_diffs = timestamps_sorted.diff().dropna()
        avg_days = time_diffs.dt.total_seconds().mean() / (24 * 3600)
        
        if avg_days < 1:
            pattern = 'daily'
        elif avg_days < 7:
            pattern = 'weekly'
        elif avg_days < 30:
            pattern = 'monthly'
        else:
            pattern = 'sporadic'
            
        return {
            'avg_days_between': avg_days,
            'frequency_pattern': pattern
        }
    
    def generate_mood_timeline(self, messages, user_id):
        """Generate mood timeline analysis"""
        user_messages = [msg for msg in messages if msg['sender'] == 'user']
        
        timeline_data = []
        for msg in user_messages:
            sentiment = self.analyze_sentiment(msg['content'])
            crisis = self.detect_crisis_indicators(msg['content'])
            
            timeline_data.append({
                'timestamp': msg['timestamp'],
                'sentiment_score': sentiment['combined_score'],
                'sentiment': sentiment['sentiment'],
                'crisis_score': crisis['crisis_score'],
                'message_length': len(msg['content']),
                'content_preview': msg['content'][:100] + '...' if len(msg['content']) > 100 else msg['content']
            })
        
        return timeline_data
    
    def generate_insights(self, analysis_data):
        """Generate actionable insights from analysis"""
        insights = []
        
        # Sentiment insights
        if 'mood_timeline' in analysis_data:
            timeline = analysis_data['mood_timeline']
            if timeline:
                recent_sentiments = [item['sentiment_score'] for item in timeline[-5:]]
                avg_recent_sentiment = np.mean(recent_sentiments)
                
                if avg_recent_sentiment < -0.3:
                    insights.append({
                        'type': 'warning',
                        'category': 'mood',
                        'message': 'Se detecta una tendencia negativa en el estado de ánimo reciente. Considera programar una sesión con tu terapeuta.',
                        'priority': 'high'
                    })
                elif avg_recent_sentiment > 0.3:
                    insights.append({
                        'type': 'positive',
                        'category': 'mood',
                        'message': 'Se observa una mejora en tu estado de ánimo. ¡Continúa con las estrategias que te están funcionando!',
                        'priority': 'medium'
                    })
        
        # Crisis indicators
        crisis_messages = [item for item in analysis_data.get('mood_timeline', []) if item['crisis_score'] > 0]
        if crisis_messages:
            insights.append({
                'type': 'alert',
                'category': 'crisis',
                'message': 'Se han detectado indicadores de crisis. Es importante que busques apoyo profesional inmediatamente.',
                'priority': 'critical'
            })
        
        # Activity patterns
        if 'conversation_patterns' in analysis_data:
            patterns = analysis_data['conversation_patterns']
            if patterns.get('conversation_frequency', {}).get('frequency_pattern') == 'sporadic':
                insights.append({
                    'type': 'suggestion',
                    'category': 'engagement',
                    'message': 'Considera mantener conversaciones más regulares para un mejor seguimiento de tu bienestar.',
                    'priority': 'low'
                })
        
        return insights
    
    def create_visualizations(self, analysis_data, output_dir='analysis_output'):
        """Create visualizations for the analysis"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Mood timeline plot
        if 'mood_timeline' in analysis_data and analysis_data['mood_timeline']:
            timeline = analysis_data['mood_timeline']
            df = pd.DataFrame(timeline)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            
            plt.figure(figsize=(12, 6))
            plt.plot(df['timestamp'], df['sentiment_score'], marker='o', linewidth=2, markersize=6)
            plt.axhline(y=0, color='gray', linestyle='--', alpha=0.7)
            plt.title('Evolución del Estado de Ánimo', fontsize=16, fontweight='bold')
            plt.xlabel('Fecha', fontsize=12)
            plt.ylabel('Puntuación de Sentimiento', fontsize=12)
            plt.grid(True, alpha=0.3)
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{output_dir}/mood_timeline.png', dpi=300, bbox_inches='tight')
            plt.close()
            
            # Sentiment distribution
            plt.figure(figsize=(8, 6))
            sentiment_counts = df['sentiment'].value_counts()
            colors = {'positive': '#4CAF50', 'neutral': '#FFC107', 'negative': '#F44336'}
            plt.pie(sentiment_counts.values, labels=sentiment_counts.index, autopct='%1.1f%%',
                   colors=[colors.get(x, '#999999') for x in sentiment_counts.index])
            plt.title('Distribución de Sentimientos', fontsize=16, fontweight='bold')
            plt.savefig(f'{output_dir}/sentiment_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # Activity patterns
        if 'conversation_patterns' in analysis_data:
            patterns = analysis_data['conversation_patterns']
            
            # Most active hours
            if 'most_active_hours' in patterns:
                plt.figure(figsize=(10, 6))
                hours = list(patterns['most_active_hours'].keys())
                counts = list(patterns['most_active_hours'].values())
                plt.bar(hours, counts, color='#2196F3', alpha=0.7)
                plt.title('Horas Más Activas de Conversación', fontsize=16, fontweight='bold')
                plt.xlabel('Hora del Día', fontsize=12)
                plt.ylabel('Número de Mensajes', fontsize=12)
                plt.grid(True, alpha=0.3)
                plt.tight_layout()
                plt.savefig(f'{output_dir}/active_hours.png', dpi=300, bbox_inches='tight')
                plt.close()
        
        print(f"Visualizaciones guardadas en: {output_dir}")
    
    def generate_report(self, user_id, messages, output_file='mental_health_report.json'):
        """Generate comprehensive analysis report"""
        print(f"Analizando datos para usuario {user_id}...")
        
        # Perform all analyses
        mood_timeline = self.generate_mood_timeline(messages, user_id)
        conversation_patterns = self.analyze_conversation_patterns(messages)
        
        analysis_data = {
            'user_id': user_id,
            'analysis_date': datetime.now().isoformat(),
            'mood_timeline': mood_timeline,
            'conversation_patterns': conversation_patterns,
            'summary_stats': self._calculate_summary_stats(mood_timeline, conversation_patterns)
        }
        
        # Generate insights
        insights = self.generate_insights(analysis_data)
        analysis_data['insights'] = insights
        
        # Create visualizations
        self.create_visualizations(analysis_data)
        
        # Save report
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, ensure_ascii=False, indent=2, default=str)
        
        print(f"Reporte generado: {output_file}")
        return analysis_data
    
    def _calculate_summary_stats(self, mood_timeline, conversation_patterns):
        """Calculate summary statistics"""
        if not mood_timeline:
            return {}
            
        sentiment_scores = [item['sentiment_score'] for item in mood_timeline]
        crisis_scores = [item['crisis_score'] for item in mood_timeline]
        
        return {
            'avg_sentiment': np.mean(sentiment_scores),
            'sentiment_std': np.std(sentiment_scores),
            'min_sentiment': np.min(sentiment_scores),
            'max_sentiment': np.max(sentiment_scores),
            'avg_crisis_score': np.mean(crisis_scores),
            'total_conversations': conversation_patterns.get('total_messages', 0),
            'avg_message_length': conversation_patterns.get('avg_message_length', 0)
        }

def analyze_sentiment_keywords(message: str) -> Dict[str, int]:
    """Analyze sentiment based on keywords in the message."""
    positive_keywords = [
        'feliz', 'bien', 'mejor', 'genial', 'excelente', 'bueno', 'alegre',
        'contento', 'optimista', 'esperanzado', 'tranquilo', 'relajado',
        'motivado', 'confiado', 'satisfecho', 'agradecido'
    ]
    
    negative_keywords = [
        'triste', 'mal', 'deprimido', 'ansioso', 'preocupado', 'estresado',
        'agobiado', 'desesperado', 'solo', 'vacío', 'perdido', 'confundido',
        'enojado', 'frustrado', 'cansado', 'agotado', 'desesperanzado'
    ]
    
    crisis_keywords = [
        'suicidio', 'morir', 'muerte', 'acabar', 'terminar', 'no puedo más',
        'sin salida', 'desesperado', 'no vale la pena', 'lastimar', 'daño'
    ]
    
    message_lower = message.lower()
    
    positive_count = sum(1 for word in positive_keywords if word in message_lower)
    negative_count = sum(1 for word in negative_keywords if word in message_lower)
    crisis_count = sum(1 for word in crisis_keywords if word in message_lower)
    
    return {
        'positive': positive_count,
        'negative': negative_count,
        'crisis': crisis_count
    }

def calculate_sentiment_score(sentiment_counts: Dict[str, int]) -> float:
    """Calculate a sentiment score from -1 (very negative) to 1 (very positive)."""
    positive = sentiment_counts['positive']
    negative = sentiment_counts['negative']
    crisis = sentiment_counts['crisis']
    
    # Crisis keywords have double weight
    total_negative = negative + (crisis * 2)
    
    if positive + total_negative == 0:
        return 0.0
    
    return (positive - total_negative) / (positive + total_negative)

def analyze_message_patterns(messages: List[Dict]) -> Dict[str, Any]:
    """Analyze patterns in chat messages."""
    if not messages:
        return {}
    
    # Time-based analysis
    hourly_activity = defaultdict(int)
    daily_activity = defaultdict(int)
    weekly_activity = defaultdict(int)
    
    # Sentiment analysis
    sentiment_scores = []
    sentiment_over_time = []
    
    # Message characteristics
    message_lengths = []
    response_times = []
    
    # Topic analysis
    common_topics = Counter()
    
    for i, message in enumerate(messages):
        try:
            # Parse timestamp
            timestamp = datetime.fromisoformat(message.get('timestamp', '').replace('Z', '+00:00'))
            
            # Time-based patterns
            hourly_activity[timestamp.hour] += 1
            daily_activity[timestamp.strftime('%A')] += 1
            weekly_activity[timestamp.isocalendar()[1]] += 1
            
            # Only analyze user messages (not Ana's responses)
            if message.get('sender') == 'user':
                content = message.get('message', '')
                
                # Sentiment analysis
                sentiment_counts = analyze_sentiment_keywords(content)
                sentiment_score = calculate_sentiment_score(sentiment_counts)
                sentiment_scores.append(sentiment_score)
                sentiment_over_time.append({
                    'timestamp': timestamp.isoformat(),
                    'score': sentiment_score,
                    'counts': sentiment_counts
                })
                
                # Message characteristics
                message_lengths.append(len(content))
                
                # Simple topic extraction (common words)
                words = re.findall(r'\b\w+\b', content.lower())
                # Filter out common stop words
                stop_words = {'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'me', 'mi', 'tu', 'si', 'yo', 'he', 'ha', 'muy', 'más', 'pero', 'como', 'todo', 'una', 'está', 'ser', 'hacer', 'puede', 'bien', 'ya', 'vez', 'día', 'vida', 'tiempo'}
                meaningful_words = [word for word in words if len(word) > 3 and word not in stop_words]
                common_topics.update(meaningful_words)
                
                # Calculate response time if there's a previous message
                if i > 0:
                    prev_timestamp = datetime.fromisoformat(messages[i-1].get('timestamp', '').replace('Z', '+00:00'))
                    response_time = (timestamp - prev_timestamp).total_seconds() / 60  # in minutes
                    if response_time < 60:  # Only consider responses within an hour
                        response_times.append(response_time)
        
        except Exception as e:
            print(f"Error processing message {i}: {e}")
            continue
    
    # Calculate statistics
    analysis_results = {
        'total_messages': len(messages),
        'user_messages': len([m for m in messages if m.get('sender') == 'user']),
        'ana_responses': len([m for m in messages if m.get('sender') == 'ana']),
        'time_patterns': {
            'hourly_activity': dict(hourly_activity),
            'daily_activity': dict(daily_activity),
            'weekly_activity': dict(weekly_activity),
            'most_active_hour': max(hourly_activity.items(), key=lambda x: x[1])[0] if hourly_activity else None,
            'most_active_day': max(daily_activity.items(), key=lambda x: x[1])[0] if daily_activity else None
        },
        'sentiment_analysis': {
            'average_sentiment': statistics.mean(sentiment_scores) if sentiment_scores else 0,
            'sentiment_trend': sentiment_over_time[-10:] if sentiment_over_time else [],  # Last 10 messages
            'positive_messages': len([s for s in sentiment_scores if s > 0.1]),
            'negative_messages': len([s for s in sentiment_scores if s < -0.1]),
            'neutral_messages': len([s for s in sentiment_scores if -0.1 <= s <= 0.1])
        },
        'message_characteristics': {
            'average_length': statistics.mean(message_lengths) if message_lengths else 0,
            'median_length': statistics.median(message_lengths) if message_lengths else 0,
            'average_response_time': statistics.mean(response_times) if response_times else 0,
            'median_response_time': statistics.median(response_times) if response_times else 0
        },
        'common_topics': dict(common_topics.most_common(10)),
        'analysis_timestamp': datetime.now().isoformat()
    }
    
    return analysis_results

def main():
    """Main function to run chat data analysis."""
    print("🔍 Iniciando análisis de datos de chat...")
    
    # Sample data for demonstration (in a real scenario, this would come from MongoDB)
    sample_messages = [
        {
            'sender': 'user',
            'message': 'Hola Ana, me siento muy triste hoy',
            'timestamp': '2024-01-15T10:30:00Z'
        },
        {
            'sender': 'ana',
            'message': 'Hola, lamento escuchar que te sientes triste. ¿Puedes contarme qué está pasando?',
            'timestamp': '2024-01-15T10:30:30Z'
        },
        {
            'sender': 'user',
            'message': 'He tenido problemas en el trabajo y me siento muy estresado y ansioso',
            'timestamp': '2024-01-15T10:32:00Z'
        },
        {
            'sender': 'ana',
            'message': 'Entiendo que el estrés laboral puede ser muy abrumador. ¿Has intentado alguna técnica de relajación?',
            'timestamp': '2024-01-15T10:32:45Z'
        },
        {
            'sender': 'user',
            'message': 'No, no sé por dónde empezar. Me siento perdido',
            'timestamp': '2024-01-15T10:35:00Z'
        },
        {
            'sender': 'user',
            'message': 'Hoy me siento un poco mejor, gracias por la ayuda de ayer',
            'timestamp': '2024-01-16T09:15:00Z'
        }
    ]
    
    # Perform analysis
    results = analyze_message_patterns(sample_messages)
    
    # Display results
    print("\n📊 RESULTADOS DEL ANÁLISIS:")
    print("=" * 50)
    
    print(f"\n📈 Estadísticas Generales:")
    print(f"  • Total de mensajes: {results['total_messages']}")
    print(f"  • Mensajes del usuario: {results['user_messages']}")
    print(f"  • Respuestas de Ana: {results['ana_responses']}")
    
    if results.get('time_patterns'):
        tp = results['time_patterns']
        print(f"\n⏰ Patrones de Tiempo:")
        print(f"  • Hora más activa: {tp.get('most_active_hour', 'N/A')}:00")
        print(f"  • Día más activo: {tp.get('most_active_day', 'N/A')}")
    
    if results.get('sentiment_analysis'):
        sa = results['sentiment_analysis']
        print(f"\n😊 Análisis de Sentimientos:")
        print(f"  • Sentimiento promedio: {sa.get('average_sentiment', 0):.2f} (-1 a 1)")
        print(f"  • Mensajes positivos: {sa.get('positive_messages', 0)}")
        print(f"  • Mensajes negativos: {sa.get('negative_messages', 0)}")
        print(f"  • Mensajes neutrales: {sa.get('neutral_messages', 0)}")
    
    if results.get('message_characteristics'):
        mc = results['message_characteristics']
        print(f"\n📝 Características de Mensajes:")
        print(f"  • Longitud promedio: {mc.get('average_length', 0):.1f} caracteres")
        print(f"  • Tiempo de respuesta promedio: {mc.get('average_response_time', 0):.1f} minutos")
    
    if results.get('common_topics'):
        print(f"\n🏷️ Temas Comunes:")
        for topic, count in list(results['common_topics'].items())[:5]:
            print(f"  • {topic}: {count} menciones")
    
    print(f"\n✅ Análisis completado: {results.get('analysis_timestamp', 'N/A')}")
    
    # Save results to file
    output_file = 'chat_analysis_results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Resultados guardados en: {output_file}")

if __name__ == "__main__":
    main()
