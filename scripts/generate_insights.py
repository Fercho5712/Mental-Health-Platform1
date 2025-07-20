import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob
import re
from collections import Counter, defaultdict
import warnings
warnings.filterwarnings('ignore')

class InsightGenerator:
    def __init__(self):
        self.insight_categories = {
            'mood_trends': 'Tendencias de Estado de Ánimo',
            'behavioral_patterns': 'Patrones de Comportamiento',
            'crisis_prevention': 'Prevención de Crisis',
            'treatment_effectiveness': 'Efectividad del Tratamiento',
            'social_factors': 'Factores Sociales',
            'lifestyle_factors': 'Factores de Estilo de Vida'
        }
        
        self.severity_levels = {
            'critical': {'priority': 1, 'color': '#d32f2f', 'icon': '🚨'},
            'high': {'priority': 2, 'color': '#f57c00', 'icon': '⚠️'},
            'medium': {'priority': 3, 'color': '#fbc02d', 'icon': '💡'},
            'low': {'priority': 4, 'color': '#388e3c', 'icon': 'ℹ️'}
        }
    
    def load_user_data(self, user_id, days_back=30):
        """Load comprehensive user data for analysis"""
        # In a real implementation, this would query multiple data sources
        # For demo, we'll generate comprehensive sample data
        return self._generate_comprehensive_sample_data(user_id, days_back)
    
    def _generate_comprehensive_sample_data(self, user_id, days_back):
        """Generate comprehensive sample data"""
        np.random.seed(user_id)
        
        dates = pd.date_range(
            start=datetime.now() - timedelta(days=days_back),
            end=datetime.now(),
            freq='D'
        )
        
        data = {
            'chat_sessions': [],
            'mood_entries': [],
            'therapy_sessions': [],
            'medication_logs': [],
            'activity_logs': []
        }
        
        # Generate chat sessions
        for i, date in enumerate(dates):
            if np.random.random() > 0.3:  # 70% chance of chat activity
                num_sessions = np.random.poisson(1.2)
                for session in range(max(1, num_sessions)):
                    data['chat_sessions'].append({
                        'date': date,
                        'session_duration': np.random.normal(15, 5),  # minutes
                        'message_count': np.random.poisson(8),
                        'sentiment_score': np.random.normal(0, 0.4),
                        'crisis_indicators': np.random.random() < 0.05,  # 5% chance
                        'topics_discussed': np.random.choice(['anxiety', 'depression', 'relationships', 'work', 'family'], 
                                                           size=np.random.randint(1, 4), replace=False).tolist()
                    })
        
        # Generate mood entries
        for date in dates:
            if np.random.random() > 0.2:  # 80% chance of mood entry
                data['mood_entries'].append({
                    'date': date,
                    'mood_score': np.clip(np.random.normal(5, 2), 1, 10),
                    'anxiety_level': np.clip(np.random.normal(4, 2), 1, 10),
                    'energy_level': np.clip(np.random.normal(6, 2), 1, 10),
                    'sleep_quality': np.clip(np.random.normal(7, 1.5), 1, 10),
                    'social_interaction': np.random.choice([0, 1], p=[0.4, 0.6]),
                    'exercise': np.random.choice([0, 1], p=[0.6, 0.4]),
                    'stressful_events': np.random.choice([0, 1], p=[0.8, 0.2])
                })
        
        # Generate therapy sessions
        therapy_dates = pd.date_range(start=dates[0], end=dates[-1], freq='W')
        for date in therapy_dates:
            if np.random.random() > 0.1:  # 90% attendance rate
                data['therapy_sessions'].append({
                    'date': date,
                    'session_type': np.random.choice(['individual', 'group', 'family']),
                    'duration': np.random.choice([45, 60, 90]),
                    'therapist_notes': np.random.choice(['good_progress', 'stable', 'needs_attention']),
                    'homework_completed': np.random.choice([0, 1], p=[0.3, 0.7]),
                    'session_rating': np.random.randint(3, 6)  # 1-5 scale
                })
        
        return data
    
    def analyze_mood_trends(self, user_data):
        """Analyze mood trends and patterns"""
        mood_entries = pd.DataFrame(user_data['mood_entries'])
        if mood_entries.empty:
            return {}
        
        mood_entries['date'] = pd.to_datetime(mood_entries['date'])
        mood_entries = mood_entries.sort_values('date')
        
        # Calculate trends
        recent_mood = mood_entries.tail(7)['mood_score'].mean()
        previous_mood = mood_entries.head(7)['mood_score'].mean() if len(mood_entries) > 14 else recent_mood
        
        mood_trend = recent_mood - previous_mood
        
        # Identify patterns
        mood_entries['day_of_week'] = mood_entries['date'].dt.day_name()
        weekly_pattern = mood_entries.groupby('day_of_week')['mood_score'].mean()
        
        # Volatility analysis
        mood_volatility = mood_entries['mood_score'].std()
        
        insights = []
        
        # Trend insights
        if mood_trend > 0.5:
            insights.append({
                'category': 'mood_trends',
                'severity': 'medium',
                'title': 'Mejora en el Estado de Ánimo',
                'description': f'Tu estado de ánimo ha mejorado {mood_trend:.1f} puntos en la última semana.',
                'recommendation': 'Continúa con las estrategias que te están funcionando.',
                'data': {'trend_value': mood_trend, 'recent_avg': recent_mood}
            })
        elif mood_trend < -0.5:
            insights.append({
                'category': 'mood_trends',
                'severity': 'high',
                'title': 'Declive en el Estado de Ánimo',
                'description': f'Tu estado de ánimo ha disminuido {abs(mood_trend):.1f} puntos en la última semana.',
                'recommendation': 'Considera programar una sesión adicional con tu terapeuta.',
                'data': {'trend_value': mood_trend, 'recent_avg': recent_mood}
            })
        
        # Volatility insights
        if mood_volatility > 2.5:
            insights.append({
                'category': 'mood_trends',
                'severity': 'medium',
                'title': 'Alta Variabilidad en el Estado de Ánimo',
                'description': 'Se observan cambios frecuentes en tu estado de ánimo.',
                'recommendation': 'Practica técnicas de regulación emocional y mantén rutinas estables.',
                'data': {'volatility': mood_volatility}
            })
        
        # Weekly pattern insights
        worst_day = weekly_pattern.idxmin()
        best_day = weekly_pattern.idxmax()
        
        if weekly_pattern[worst_day] < weekly_pattern[best_day] - 1:
            insights.append({
                'category': 'behavioral_patterns',
                'severity': 'low',
                'title': f'Patrón Semanal Identificado',
                'description': f'Los {worst_day}s tienden a ser más difíciles, mientras que los {best_day}s son mejores.',
                'recommendation': f'Planifica actividades de autocuidado especialmente para los {worst_day}s.',
                'data': {'worst_day': worst_day, 'best_day': best_day, 'pattern': weekly_pattern.to_dict()}
            })
        
        return {
            'insights': insights,
            'mood_trend': mood_trend,
            'mood_volatility': mood_volatility,
            'weekly_pattern': weekly_pattern.to_dict()
        }
    
    def analyze_behavioral_patterns(self, user_data):
        """Analyze behavioral patterns and correlations"""
        mood_entries = pd.DataFrame(user_data['mood_entries'])
        chat_sessions = pd.DataFrame(user_data['chat_sessions'])
        
        insights = []
        
        if not mood_entries.empty:
            # Sleep-mood correlation
            sleep_mood_corr = mood_entries['sleep_quality'].corr(mood_entries['mood_score'])
            
            if sleep_mood_corr > 0.3:
                insights.append({
                    'category': 'lifestyle_factors',
                    'severity': 'medium',
                    'title': 'Fuerte Conexión Sueño-Estado de Ánimo',
                    'description': f'La calidad del sueño está fuertemente correlacionada con tu estado de ánimo (r={sleep_mood_corr:.2f}).',
                    'recommendation': 'Prioriza una buena higiene del sueño para mejorar tu bienestar general.',
                    'data': {'correlation': sleep_mood_corr}
                })
            
            # Exercise impact
            exercise_days = mood_entries[mood_entries['exercise'] == 1]['mood_score'].mean()
            no_exercise_days = mood_entries[mood_entries['exercise'] == 0]['mood_score'].mean()
            
            if exercise_days > no_exercise_days + 0.5:
                insights.append({
                    'category': 'lifestyle_factors',
                    'severity': 'medium',
                    'title': 'Beneficio del Ejercicio',
                    'description': f'Tu estado de ánimo es {exercise_days - no_exercise_days:.1f} puntos mejor en días con ejercicio.',
                    'recommendation': 'Intenta incorporar actividad física regular en tu rutina.',
                    'data': {'exercise_benefit': exercise_days - no_exercise_days}
                })
            
            # Social interaction impact
            social_days = mood_entries[mood_entries['social_interaction'] == 1]['mood_score'].mean()
            isolated_days = mood_entries[mood_entries['social_interaction'] == 0]['mood_score'].mean()
            
            if social_days > isolated_days + 0.5:
                insights.append({
                    'category': 'social_factors',
                    'severity': 'medium',
                    'title': 'Beneficio de la Interacción Social',
                    'description': f'Tu estado de ánimo mejora {social_days - isolated_days:.1f} puntos en días con interacción social.',
                    'recommendation': 'Mantén conexiones sociales regulares, incluso si son breves.',
                    'data': {'social_benefit': social_days - isolated_days}
                })
        
        # Chat pattern analysis
        if not chat_sessions.empty:
            chat_sessions['date'] = pd.to_datetime(chat_sessions['date'])
            
            # Crisis indicator patterns
            crisis_sessions = chat_sessions[chat_sessions['crisis_indicators'] == True]
            if len(crisis_sessions) > 0:
                crisis_frequency = len(crisis_sessions) / len(chat_sessions)
                
                if crisis_frequency > 0.1:  # More than 10% of sessions
                    insights.append({
                        'category': 'crisis_prevention',
                        'severity': 'high',
                        'title': 'Indicadores de Crisis Frecuentes',
                        'description': f'Se detectan indicadores de crisis en {crisis_frequency:.1%} de las sesiones de chat.',
                        'recommendation': 'Programa seguimiento más frecuente y considera ajustar el plan de tratamiento.',
                        'data': {'crisis_frequency': crisis_frequency}
                    })
            
            # Chat frequency patterns
            daily_chats = chat_sessions.groupby(chat_sessions['date'].dt.date).size()
            avg_daily_chats = daily_chats.mean()
            
            if avg_daily_chats > 3:
                insights.append({
                    'category': 'behavioral_patterns',
                    'severity': 'medium',
                    'title': 'Alta Frecuencia de Chat',
                    'description': f'Promedio de {avg_daily_chats:.1f} sesiones de chat por día.',
